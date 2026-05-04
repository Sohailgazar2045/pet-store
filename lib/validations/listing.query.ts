import { z } from "zod"

const optionalMoney = z.preprocess(
  (v) => (v === "" || v === undefined ? undefined : v),
  z.coerce.number().min(0).optional()
)

/** Query string parser for GET /api/listings */
export const listingsQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.enum(["cattle", "pets"]).optional(),
  subcategory: z.string().optional(),
  city: z.string().trim().optional(),
  minPrice: optionalMoney,
  maxPrice: optionalMoney,
  sort: z
    .enum(["newest", "price_asc", "price_desc", "views"])
    .optional()
    .default("newest"),
  page: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z.coerce.number().int().min(1).optional().default(1)
  ),
  limit: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    z.coerce.number().int().min(1).max(48).optional().default(12)
  ),
  /** Public browse defaults to `active` only. */
  status: z
    .enum(["active", "sold", "pending", "rejected"])
    .optional()
    .default("active"),
})

export type ListingsQuery = z.infer<typeof listingsQuerySchema>
