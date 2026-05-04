import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import { toSafeUser } from "@/lib/user-serialize"
import { successJson, errorJson } from "@/lib/api-response"
import { getAccessPayloadOrError } from "@/lib/request-auth"
import { profileUpdateSchema } from "@/lib/validations/profile.schema"
import { User } from "@/models/User"

export const runtime = "nodejs"

/**
 * PATCH /api/me/profile — update name, phone, location.
 */
export async function PATCH(req: Request) {
  const gate = getAccessPayloadOrError(req)
  if (gate instanceof Response) return gate

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorJson("Invalid JSON body", 400, "INVALID_JSON")
  }

  const parsed = profileUpdateSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Validation failed"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  const patch = parsed.data

  try {
    await connectDB()
  } catch (e) {
    console.error("[api/me/profile]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const uid = new Types.ObjectId(gate.sub)
  const user = await User.findById(uid)
  if (!user) {
    return errorJson("User not found", 404, "NOT_FOUND")
  }

  if (patch.name !== undefined) user.name = patch.name
  if (patch.phone !== undefined) {
    user.phone = patch.phone === "" ? undefined : patch.phone
  }
  if (patch.location !== undefined) {
    const cur = (user.toObject().location ?? {}) as Record<string, unknown>
    user.set("location", {
      city: patch.location.city ?? (cur.city as string | undefined),
      state: patch.location.state ?? (cur.state as string | undefined),
      country: patch.location.country ?? (cur.country as string | undefined),
      coordinates:
        patch.location.coordinates !== undefined
          ? patch.location.coordinates
          : (cur.coordinates as { lat?: number; lng?: number } | undefined),
    })
  }

  await user.save()
  const lean = user.toObject()
  return successJson({ user: toSafeUser(lean) })
}
