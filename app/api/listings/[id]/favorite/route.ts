import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import { Favorite } from "@/models/Favorite"
import { Listing } from "@/models/Listing"
import { successJson, errorJson } from "@/lib/api-response"
import { getAccessPayloadOrError } from "@/lib/request-auth"

export const runtime = "nodejs"

/**
 * POST /api/listings/[id]/favorite — toggle favorite for current user.
 */
export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  const gate = getAccessPayloadOrError(req)
  if (gate instanceof Response) return gate

  const { id } = context.params
  if (!Types.ObjectId.isValid(id)) {
    return errorJson("Invalid listing id", 400, "INVALID_ID")
  }

  try {
    await connectDB()
  } catch (e) {
    console.error("[favorite]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const listingExists = await Listing.exists({ _id: new Types.ObjectId(id) })
  if (!listingExists) {
    return errorJson("Listing not found", 404, "NOT_FOUND")
  }

  const userId = new Types.ObjectId(gate.sub)
  const listingOid = new Types.ObjectId(id)

  const existing = await Favorite.findOne({
    user: userId,
    listing: listingOid,
  })

  if (existing) {
    await existing.deleteOne()
    return successJson({ isFavorited: false })
  }

  await Favorite.create({ user: userId, listing: listingOid })
  return successJson({ isFavorited: true })
}
