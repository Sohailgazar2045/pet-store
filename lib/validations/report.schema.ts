import { z } from "zod"

export const reportCreateSchema = z.object({
  reason: z.enum([
    "spam",
    "fraud",
    "inappropriate",
    "wrong_category",
    "other",
  ]),
  description: z.string().trim().max(500).optional(),
})

export type ReportCreateInput = z.infer<typeof reportCreateSchema>
