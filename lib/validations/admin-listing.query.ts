import { z } from "zod"

export const adminListingsQuerySchema = z.object({
  status: z
    .enum(["active", "sold", "pending", "rejected"])
    .optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
})

export type AdminListingsQuery = z.infer<typeof adminListingsQuerySchema>
