import { z } from "zod"

const imagePair = z.object({
  public_id: z.string().min(1),
  url: z.string().url(),
})

/** Subcategories typically used for cattle vs pets (must match `Listing` enum). */
export const CATTLE_SUBCATEGORIES = [
  "cow",
  "bull",
  "calf",
  "goat",
  "sheep",
  "horse",
] as const

export const PET_SUBCATEGORIES = [
  "dog",
  "cat",
  "bird",
  "rabbit",
  "fish",
  "other",
] as const

const allSubcategories = [
  ...CATTLE_SUBCATEGORIES,
  ...PET_SUBCATEGORIES,
] as const

/**
 * Raw fields for POST /api/listings (no category/subcategory cross-check here —
 * that lives on `listingCreateSchema` / `listingUpdateSchema`).
 */
const listingCreateFieldsSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),
  description: z.string().trim().min(1, "Description is required").max(2000),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  category: z.enum(["cattle", "pets"]),
  subcategory: z.enum(allSubcategories),
  breed: z.string().trim().max(120).optional(),
  age: z
    .object({
      value: z.coerce.number().positive(),
      unit: z.enum(["days", "months", "years"]),
    })
    .optional(),
  gender: z.enum(["male", "female", "unknown"]).optional(),
  images: z
    .array(imagePair)
    .min(1, "Add at least one image")
    .max(8, "Maximum 8 images"),
  location: z.object({
    city: z.string().trim().min(1, "City is required"),
    state: z.string().trim().min(1, "State is required"),
    country: z.string().trim().optional().default("Pakistan"),
    coordinates: z
      .object({
        lat: z.number().optional(),
        lng: z.number().optional(),
      })
      .optional(),
  }),
  tags: z.array(z.string().trim().max(40)).max(20).optional(),
})

/** Body for POST /api/listings (seller is set server-side). */
export const listingCreateSchema = listingCreateFieldsSchema.superRefine(
  (data, ctx) => {
    const allowed =
      data.category === "cattle" ? CATTLE_SUBCATEGORIES : PET_SUBCATEGORIES
    if (!(allowed as readonly string[]).includes(data.subcategory)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pick a subcategory that matches the category",
        path: ["subcategory"],
      })
    }
  }
)

export type ListingCreateInput = z.infer<typeof listingCreateSchema>

/** Partial update — omit fields you do not change. At least one field expected at route layer. */
export const listingUpdateSchema = listingCreateFieldsSchema
  .partial()
  .extend({
    /** Sellers may set `sold` on active listings via PUT /api/listings/[id]. */
    status: z.enum(["sold"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.category != null && data.subcategory != null) {
      const allowed =
        data.category === "cattle" ? CATTLE_SUBCATEGORIES : PET_SUBCATEGORIES
      if (!(allowed as readonly string[]).includes(data.subcategory)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Subcategory does not match category",
          path: ["subcategory"],
        })
      }
    }
    if (data.images != null) {
      if (data.images.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one image",
          path: ["images"],
        })
      }
      if (data.images.length > 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum 8 images",
          path: ["images"],
        })
      }
    }
  })

export type ListingUpdateInput = z.infer<typeof listingUpdateSchema>

/** Admin moderation */
export const adminListingStatusSchema = z.object({
  status: z.enum(["active", "sold", "pending", "rejected"]),
})

/**
 * Client form fields (no `images`; tags as comma string). Age is flat for react-hook-form.
 */
export const listingFormFieldsSchema = z
  .object({
    title: listingCreateFieldsSchema.shape.title,
    description: listingCreateFieldsSchema.shape.description,
    price: listingCreateFieldsSchema.shape.price,
    category: listingCreateFieldsSchema.shape.category,
    subcategory: listingCreateFieldsSchema.shape.subcategory,
    breed: listingCreateFieldsSchema.shape.breed,
    gender: listingCreateFieldsSchema.shape.gender,
    location: listingCreateFieldsSchema.shape.location,
    tagsInput: z.string().optional(),
    ageValue: z.coerce.number().positive().optional(),
    ageUnit: z.enum(["days", "months", "years"]).optional(),
  })
  .superRefine((data, ctx) => {
    const allowed =
      data.category === "cattle" ? CATTLE_SUBCATEGORIES : PET_SUBCATEGORIES
    if (!(allowed as readonly string[]).includes(data.subcategory)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pick a type that matches the category",
        path: ["subcategory"],
      })
    }

    const hasV = data.ageValue != null && !Number.isNaN(data.ageValue)
    const hasU = data.ageUnit != null
    if (hasV !== hasU) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter both age and unit, or leave both empty",
        path: ["ageValue"],
      })
    }
  })

export type ListingFormFields = z.infer<typeof listingFormFieldsSchema>
