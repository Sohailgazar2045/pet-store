"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Trash2, Plus, Camera, Info, ShieldCheck, MapPin } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState, type ComponentProps } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
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
import { cn } from "@/lib/utils"

/**
 * Base UI Select + Radix `Slot` (FormControl) on the trigger breaks selection updates.
 * Apply field a11y props directly on the trigger instead.
 */
function FormSelectTrigger(props: ComponentProps<typeof SelectTrigger>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  return (
    <SelectTrigger
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function parseTags(input?: string): string[] | undefined {
  if (!input?.trim()) return undefined
  const tags = input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20)
  return tags.length ? tags : undefined
}

export function ListingForm({ className }: { className?: string }) {
  const router = useRouter()
  const ready = useAuthStore((s) => s.ready)
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
    const token = useAuthStore.getState().accessToken
    if (!token) {
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
        headers: { Authorization: `Bearer ${token}` },
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
    if (!ready) {
      toast.error("Restoring your session — try again in a moment.")
      return
    }
    const token = useAuthStore.getState().accessToken
    if (!token) {
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
        { token }
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
        className={cn("space-y-12", className)}
      >
        {/* Media Selection */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <Camera className="size-5" />
              </div>
              <h2 className="text-2xl font-black">Visual Asset Gallery</h2>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div
                  key={img.public_id}
                  className="relative aspect-square overflow-hidden rounded-3xl border-2 border-white shadow-lg group"
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 rounded-xl bg-white/90 p-2 shadow-xl hover:bg-rose-500 hover:text-white transition-all text-rose-500"
                    onClick={() =>
                      setImages((prev) =>
                        prev.filter((i) => i.public_id !== img.public_id)
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              {images.length < 8 && (
                 <label className={cn(
                    "relative aspect-square rounded-3xl border-4 border-dashed border-muted flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all",
                    uploading && "opacity-50 pointer-events-none"
                 )}>
                    {uploading ? (
                       <Loader2 className="size-8 animate-spin text-primary" />
                    ) : (
                       <>
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                             <Plus className="size-6" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Add Photo</span>
                       </>
                    )}
                    <input 
                       type="file"
                       className="hidden"
                       multiple
                       accept="image/*"
                       onChange={(e) => void handleFiles(e.target.files)}
                       disabled={uploading || !ready}
                    />
                 </label>
              )}
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Maximum 8 high-resolution images · Verified Secure Hosting
           </p>
        </section>

        {/* Essential Information */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <Info className="size-5" />
              </div>
              <h2 className="text-2xl font-black">Market Specifications</h2>
           </div>

           <div className="grid gap-8 md:grid-cols-2 bg-muted/20 p-8 rounded-[2.5rem] border-2 border-white shadow-inner">
             <FormField
               control={form.control}
               name="title"
               render={({ field }) => (
                 <FormItem className="md:col-span-2">
                   <FormLabel className="text-[11px] font-black uppercase tracking-widest text-primary">Asset Title</FormLabel>
                   <FormControl>
                     <Input className="h-14 rounded-2xl border-none shadow-sm focus:ring-4 focus:ring-primary/5 px-6 font-bold" placeholder="e.g. Sahiwal Breeding Bull — Grade A" {...field} />
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
                   <FormLabel className="text-[11px] font-black uppercase tracking-widest text-primary">Core Category</FormLabel>
                   <Select
                     value={field.value}
                     onValueChange={(v) => {
                       field.onChange(v)
                       form.setValue(
                         "subcategory",
                         v === "cattle" ? "cow" : "dog",
                         { shouldValidate: true, shouldDirty: true }
                       )
                     }}
                   >
                     <FormSelectTrigger className="h-14 w-full rounded-2xl border-none shadow-sm px-6 font-bold">
                       <SelectValue placeholder="Select category" />
                     </FormSelectTrigger>
                     <SelectContent className="rounded-2xl border-none shadow-2xl">
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
                   <FormLabel className="text-[11px] font-black uppercase tracking-widest text-primary">Asset Classification</FormLabel>
                   <Select
                     key={category}
                     value={field.value}
                     onValueChange={field.onChange}
                   >
                     <FormSelectTrigger className="h-14 w-full rounded-2xl border-none shadow-sm px-6 font-bold">
                       <SelectValue placeholder="Select type" />
                     </FormSelectTrigger>
                     <SelectContent className="rounded-2xl border-none shadow-2xl">
                       {subOptions.map((s) => (
                         <SelectItem key={s} value={s}>{s}</SelectItem>
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
                   <FormLabel className="text-[11px] font-black uppercase tracking-widest text-primary">Asking Price (PKR)</FormLabel>
                   <FormControl>
                     <div className="relative">
                        <Input type="number" min={0} className="h-14 rounded-2xl border-none shadow-sm px-6 pl-14 font-black text-lg" {...field} />
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">Rs.</span>
                     </div>
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
                   <FormLabel className="text-[11px] font-black uppercase tracking-widest text-primary">Lineage / Breed</FormLabel>
                   <FormControl>
                     <Input className="h-14 rounded-2xl border-none shadow-sm px-6 font-bold" placeholder="Optional" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
           </div>
        </section>

        {/* Location & Status */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <MapPin className="size-5" />
              </div>
              <h2 className="text-2xl font-black">Regional Presence</h2>
           </div>

           <div className="grid gap-8 md:grid-cols-2 bg-muted/20 p-8 rounded-[2.5rem] border-2 border-white shadow-inner">
             <FormField
               control={form.control}
               name="location.city"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className="text-[11px] font-black uppercase tracking-widest text-primary">Metropolis / City</FormLabel>
                   <FormControl>
                     <Input className="h-14 rounded-2xl border-none shadow-sm px-6 font-bold" {...field} />
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
                   <FormLabel className="text-[11px] font-black uppercase tracking-widest text-primary">Territory / Province</FormLabel>
                   <FormControl>
                     <Input className="h-14 rounded-2xl border-none shadow-sm px-6 font-bold" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
           </div>
        </section>

        {/* Narrative & Discovery */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <ShieldCheck className="size-5" />
              </div>
              <h2 className="text-2xl font-black">Trade Narrative</h2>
           </div>

           <div className="bg-muted/20 p-8 rounded-[2.5rem] border-2 border-white shadow-inner space-y-8">
             <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel className="text-[11px] font-black uppercase tracking-widest text-primary">Technical Description</FormLabel>
                   <FormControl>
                     <Textarea rows={6} className="rounded-3xl border-none shadow-sm p-8 font-medium leading-relaxed" placeholder="Elaborate on health metrics, temperament, and trade terms…" {...field} />
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
                   <FormLabel className="text-[11px] font-black uppercase tracking-widest text-primary">Market Tags</FormLabel>
                   <FormControl>
                     <Input className="h-14 rounded-2xl border-none shadow-sm px-6 font-bold" placeholder="e.g. Vaccinated, Premium, Dairy" {...field} />
                   </FormControl>
                   <FormDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Separate with commas for optimal discovery</FormDescription>
                   <FormMessage />
                 </FormItem>
               )}
             />
           </div>
        </section>

        <div className="flex items-center justify-end gap-6 pt-10 border-t border-muted">
          <Button
            type="button"
            variant="ghost"
            className="h-14 px-8 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-muted"
            onClick={() => router.back()}
          >
            Abort
          </Button>
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting || !ready}
            className="h-14 px-12 rounded-full font-black uppercase tracking-widest text-[11px] shadow-[0_20px_50px_rgba(var(--primary),0.3)] hover:scale-105 transition-all"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Processing Protocol…
              </>
            ) : (
              "Submit Listing for Review"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

