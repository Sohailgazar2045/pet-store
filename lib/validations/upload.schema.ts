import { z } from "zod"

/** Body for DELETE /api/upload */
export const deleteUploadSchema = z.object({
  public_id: z.string().trim().min(1, "public_id is required"),
})

export type DeleteUploadInput = z.infer<typeof deleteUploadSchema>
