import { z } from "zod"

const emptyToUndef = (v: unknown) =>
  v === "" || v === undefined ? undefined : v

/** GET /api/me/listings */
export const myListingsQuerySchema = z.object({
  page: z.preprocess(
    emptyToUndef,
    z.coerce.number().int().min(1).optional().default(1)
  ),
  limit: z.preprocess(
    emptyToUndef,
    z.coerce.number().int().min(1).max(48).optional().default(12)
  ),
  status: z
    .enum(["active", "sold", "pending", "rejected"])
    .optional(),
  sort: z.enum(["newest", "oldest", "price_asc", "price_desc"]).default("newest"),
})

export type MyListingsQuery = z.infer<typeof myListingsQuerySchema>

/** GET /api/me/favorites */
export const myFavoritesQuerySchema = z.object({
  page: z.preprocess(
    emptyToUndef,
    z.coerce.number().int().min(1).optional().default(1)
  ),
  limit: z.preprocess(
    emptyToUndef,
    z.coerce.number().int().min(1).max(48).optional().default(12)
  ),
})

export type MyFavoritesQuery = z.infer<typeof myFavoritesQuerySchema>
