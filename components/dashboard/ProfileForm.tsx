"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { apiPatch } from "@/lib/api-client"
import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/validations/profile.schema"
import type { SafeUser } from "@/types"
import { useAuth } from "@/hooks/useAuth"
import { z } from "zod"

/** Full form shape; mapped to `profileUpdateSchema` on submit. */
const profileFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().max(40).optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

function buildPatch(values: ProfileFormValues): ProfileUpdateInput {
  return {
    name: values.name,
    phone: values.phone === "" ? "" : values.phone,
    location: {
      city: values.city || undefined,
      state: values.state || undefined,
      country: values.country || undefined,
    },
  }
}

type ProfileFormProps = {
  user: SafeUser
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { accessToken, refreshUser } = useAuth()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      city: user.location?.city ?? "",
      state: user.location?.state ?? "",
      country: user.location?.country ?? "",
    },
  })

  useEffect(() => {
    form.reset({
      name: user.name,
      phone: user.phone ?? "",
      city: user.location?.city ?? "",
      state: user.location?.state ?? "",
      country: user.location?.country ?? "",
    })
  }, [user, form])

  async function onSubmit(values: ProfileFormValues) {
    const patch = buildPatch(values)
    const check = profileUpdateSchema.safeParse(patch)
    if (!check.success) {
      toast.error(check.error.issues[0]?.message ?? "Invalid data")
      return
    }

    const res = await apiPatch<{ user: SafeUser }>("/api/me/profile", check.data, {
      token: accessToken,
    })
    if (!res.success) {
      toast.error(res.error)
      return
    }
    toast.success("Profile updated")
    await refreshUser()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-1.5">
          <p className="text-sm font-medium leading-none">Email</p>
          <p className="rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            {user.email}
          </p>
          <p className="text-xs text-muted-foreground">Email can’t be changed here.</p>
        </div>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" autoComplete="tel" placeholder="+92…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <p className="text-sm font-medium">Location</p>
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State / Province</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  )
}
