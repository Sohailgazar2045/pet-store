import { z } from "zod"

const locationSchema = z
  .object({
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    country: z.string().trim().optional(),
    coordinates: z
      .object({
        lat: z.number().optional(),
        lng: z.number().optional(),
      })
      .optional(),
  })
  .optional()

/** PATCH /api/me/profile */
export const profileUpdateSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120).optional(),
    phone: z.union([z.string().trim().max(40), z.literal("")]).optional(),
    location: locationSchema,
  })
  .superRefine((data, ctx) => {
    const has =
      data.name !== undefined ||
      data.phone !== undefined ||
      data.location !== undefined
    if (!has) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide at least one field to update",
      })
    }
  })

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
