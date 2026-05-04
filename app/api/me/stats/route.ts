import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import { successJson, errorJson } from "@/lib/api-response"
import { getAccessPayloadOrError } from "@/lib/request-auth"
import { Favorite } from "@/models/Favorite"
import { Listing } from "@/models/Listing"

export const runtime = "nodejs"

type StatusCounts = {
  pending: number
  active: number
  sold: number
  rejected: number
}

/**
 * GET /api/me/stats — counts for dashboard overview.
 */
export async function GET(req: Request) {
  const gate = getAccessPayloadOrError(req)
  if (gate instanceof Response) return gate

  try {
    await connectDB()
  } catch (e) {
    console.error("[api/me/stats]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const sellerId = new Types.ObjectId(gate.sub)
  const userId = sellerId

  const [agg, favorites, listingsTotal] = await Promise.all([
    Listing.aggregate<{ _id: string; n: number }>([
      { $match: { seller: sellerId } },
      { $group: { _id: "$status", n: { $sum: 1 } } },
    ]),
    Favorite.countDocuments({ user: userId }),
    Listing.countDocuments({ seller: sellerId }),
  ])

  const byStatus: StatusCounts = {
    pending: 0,
    active: 0,
    sold: 0,
    rejected: 0,
  }
  for (const row of agg) {
    const s = row._id
    if (s === "pending") byStatus.pending = row.n
    else if (s === "active") byStatus.active = row.n
    else if (s === "sold") byStatus.sold = row.n
    else if (s === "rejected") byStatus.rejected = row.n
  }

  return successJson({
    listingsTotal,
    listingsByStatus: byStatus,
    favorites: favorites,
  })
}
