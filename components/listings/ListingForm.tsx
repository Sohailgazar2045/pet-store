"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Trash2, Upload } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { apiPost } from "@/lib/api-client"
import {
  CATTLE_SUBCATEGORIES,
  PET_SUBCATEGORIES,
  listingCreateSchema,
  listingFormFieldsSchema,
  type ListingCreateInput,
  type ListingFormFields,
} from "@/lib/validations/listing.schema"
import type { ListingImage } from "@/types"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

function parseTags(input?: string): string[] | undefined {
  if (!input?.trim()) return undefined
  const tags = input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20)
  return tags.length ? tags : undefined
}

/**
 * Create listing: details + uploads via `/api/upload`.
 */
export function ListingForm({ className }: { className?: string }) {
  const router = useRouter()
  const { accessToken } = useAuth()
  const [images, setImages] = useState<ListingImage[]>([])
  const [uploading, setUploading] = useState(false)

  const form = useForm<ListingFormFields>({
    resolver: zodResolver(
      listingFormFieldsSchema
    ) as Resolver<ListingFormFields>,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "cattle",
      subcategory: "cow",
      breed: "",
      gender: undefined,
      tagsInput: "",
      ageValue: undefined,
      ageUnit: undefined,
      location: {
        city: "",
        state: "",
        country: "Pakistan",
      },
    },
  })

  const category = form.watch("category")
  const subOptions = useMemo(
    () =>
      category === "cattle" ? CATTLE_SUBCATEGORIES : PET_SUBCATEGORIES,
    [category]
  )

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    if (!accessToken) {
      toast.error("Sign in to upload photos", {
        action: {
          label: "Log in",
          onClick: () => router.push("/login?from=/listings/new"),
        },
      })
      return
    }
    const remaining = 8 - images.length
    const slice = Array.from(files).slice(0, remaining)
    if (slice.length === 0) {
      toast.error("Maximum 8 images")
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      for (const f of slice) fd.append("files", f)
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: fd,
        credentials: "include",
      })
      const json = (await res.json()) as {
        success: boolean
        error?: string
        data?: { images: ListingImage[] }
      }
      if (!json.success || !json.data?.images) {
        throw new Error(json.error ?? "Upload failed")
      }
      setImages((prev) => [...prev, ...json.data!.images].slice(0, 8))
      toast.success(`Uploaded ${json.data.images.length} image(s)`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(values: ListingFormFields) {
    if (!accessToken) {
      toast.error("Sign in to post your listing", {
        action: {
          label: "Log in",
          onClick: () => router.push("/login?from=/listings/new"),
        },
      })
      return
    }
    if (images.length < 1) {
      toast.error("Add at least one photo")
      return
    }

    const { tagsInput, ageValue, ageUnit, ...rest } = values
    const age: ListingCreateInput["age"] =
      ageValue != null && ageUnit
        ? { value: ageValue, unit: ageUnit }
        : undefined

    const payload: ListingCreateInput = {
      ...rest,
      age,
      images,
      tags: parseTags(tagsInput),
    }

    const check = listingCreateSchema.safeParse(payload)
    if (!check.success) {
      toast.error(check.error.issues[0]?.message ?? "Invalid form")
      return
    }

    try {
      const res = await apiPost<{ listing: { _id: string } }>(
        "/api/listings",
        check.data,
        { token: accessToken }
      )
      if (!res.success) {
        throw new Error(res.error)
      }
      toast.success("Listing submitted — pending review")
      router.push(`/listings/${res.data.listing._id}`)
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create listing")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8", className)}
      >
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              Up to 8 images (JPEG, PNG, WebP). Max 5MB each. Requires Cloudinary
              configured on the server.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {images.map((img) => (
                <div
                  key={img.public_id}
                  className="relative size-24 overflow-hidden rounded-lg border bg-muted"
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded bg-background/90 p-1 shadow"
                    onClick={() =>
                      setImages((prev) =>
                        prev.filter((i) => i.public_id !== img.public_id)
                      )
                    }
                    aria-label="Remove image"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={uploading || images.length >= 8}
                className="cursor-pointer"
                onChange={(e) => void handleFiles(e.target.files)}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {images.length}/8 images ·{" "}
                {uploading ? (
                  <span className="inline-flex items-center gap-1">
                    <Loader2 className="size-3 animate-spin" /> Uploading…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Upload className="size-3" /> Choose files
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sahiwal cow — excellent milk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v)
                      form.setValue(
                        "subcategory",
                        v === "cattle" ? "cow" : "dog"
                      )
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cattle">Cattle</SelectItem>
                      <SelectItem value="pets">Pets</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (PKR)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Holstein" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    value={field.value ?? "unspecified"}
                    onValueChange={(v) =>
                      field.onChange(
                        v === "unspecified" ? undefined : (v as ListingFormFields["gender"])
                      )
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unspecified">Not specified</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Age (optional)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="ageValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      placeholder="e.g. 18"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const v = e.target.value
                        field.onChange(v === "" ? undefined : Number(v))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ageUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    value={field.value ?? "unspecified"}
                    onValueChange={(v) =>
                      field.onChange(
                        v === "unspecified"
                          ? undefined
                          : (v as NonNullable<ListingFormFields["ageUnit"]>)
                      )
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pick unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unspecified">—</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="location.city"
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
              name="location.state"
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
              name="location.country"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description & tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder="Health, temperament, delivery…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tagsInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="dairy, vaccinated, halal" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit listing"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
