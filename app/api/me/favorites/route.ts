import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import { serializePublicListing } from "@/lib/listings/public-listings"
import type { PublicListing } from "@/lib/listings/public-listings"
import { successJson, errorJson } from "@/lib/api-response"
import { getAccessPayloadOrError } from "@/lib/request-auth"
import { myFavoritesQuerySchema } from "@/lib/validations/me.query"
import { Favorite } from "@/models/Favorite"

export const runtime = "nodejs"

/**
 * GET /api/me/favorites — saved listings (skips entries whose listing was removed).
 */
export async function GET(req: Request) {
  const gate = getAccessPayloadOrError(req)
  if (gate instanceof Response) return gate

  const { searchParams } = new URL(req.url)
  const raw: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    raw[key] = value
  })

  const parsed = myFavoritesQuerySchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid query"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  const q = parsed.data
  const page = q.page
  const limit = q.limit
  const skip = (page - 1) * limit

  try {
    await connectDB()
  } catch (e) {
    console.error("[api/me/favorites]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const userId = new Types.ObjectId(gate.sub)

  const [favDocs, total] = await Promise.all([
    Favorite.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "listing",
        populate: {
          path: "seller",
          select: "name phone avatar location createdAt",
        },
      })
      .lean(),
    Favorite.countDocuments({ user: userId }),
  ])

  const items: {
    favoritedAt: string
    listing: PublicListing
  }[] = []

  for (const f of favDocs) {
    const listingDoc = f.listing as Record<string, unknown> | null
    if (!listingDoc || !listingDoc._id) continue
    const favoritedAt =
      f.createdAt instanceof Date
        ? f.createdAt.toISOString()
        : new Date().toISOString()
    items.push({
      favoritedAt,
      listing: serializePublicListing(listingDoc),
    })
  }

  const pages = Math.max(1, Math.ceil(total / limit))

  return successJson({
    items,
    total,
    page,
    pages,
    limit,
    hasNext: page < pages,
    hasPrev: page > 1,
  })
}
