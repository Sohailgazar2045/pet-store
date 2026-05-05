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
import { User, Phone, MapPin, Mail, Save, Loader2 } from "lucide-react"

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
    toast.success("Identity profile updated")
    await refreshUser()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <div className="grid gap-12 lg:grid-cols-2">
           <div className="space-y-8">
              <div className="flex items-center gap-3 mb-2">
                 <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <User className="size-5" />
                 </div>
                 <h3 className="text-xl font-black">Personal Details</h3>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Legal Name</     FormLabel>
                    <FormControl>
                      <Input 
                        autoComplete="name" 
                        className="h-14 rounded-2xl bg-white/50 border-white/40 font-bold px-6 focus:ring-primary/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Primary Contact Email</FormLabel>
                <div className="flex items-center gap-4 h-14 px-6 rounded-2xl bg-muted/30 border border-transparent text-sm font-bold text-muted-foreground">
                   <Mail className="size-4 opacity-50" />
                   {user.email}
                </div>
                <p className="text-[10px] font-bold text-muted-foreground/60 italic pl-1">Authenticated via system login. Changes restricted.</p>
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Hotline</FormLabel>
                    <FormControl>
                       <div className="relative">
                          <Phone className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input 
                            type="tel" 
                            autoComplete="tel" 
                            placeholder="+92…" 
                            className="h-14 rounded-2xl bg-white/50 border-white/40 font-bold pl-14 pr-6 focus:ring-primary/20" 
                            {...field} 
                          />
                       </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
           </div>

           <div className="space-y-8">
              <div className="flex items-center gap-3 mb-2">
                 <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <MapPin className="size-5" />
                 </div>
                 <h3 className="text-xl font-black">Regional Logistics</h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                 <FormField
                   control={form.control}
                   name="city"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">City</FormLabel>
                       <FormControl>
                         <Input className="h-14 rounded-2xl bg-white/50 border-white/40 font-bold px-6" {...field} />
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
                       <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Province</FormLabel>
                       <FormControl>
                         <Input className="h-14 rounded-2xl bg-white/50 border-white/40 font-bold px-6" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
              </div>

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operating Country</FormLabel>
                    <FormControl>
                      <Input className="h-14 rounded-2xl bg-white/50 border-white/40 font-bold px-6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
                 <p className="text-xs font-bold text-primary/80 leading-relaxed">
                    Accuracy in location data helps our algorithm match your assets with local buyers, significantly reducing logistics friction.
                 </p>
              </div>
           </div>
        </div>

        <div className="flex justify-end pt-8 border-t border-white/20">
           <Button 
             type="submit" 
             disabled={form.formState.isSubmitting}
             className="h-16 px-12 rounded-full font-black text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
           >
             {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Synchronizing...
                </>
             ) : (
                <>
                  <Save className="mr-2 size-5" />
                  Save Changes
                </>
             )}
           </Button>
        </div>
      </form>
    </Form>
  )
}

