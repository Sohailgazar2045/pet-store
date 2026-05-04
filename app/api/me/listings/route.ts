import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import { serializePublicListing } from "@/lib/listings/public-listings"
import { successJson, errorJson } from "@/lib/api-response"
import { getAccessPayloadOrError } from "@/lib/request-auth"
import { myListingsQuerySchema } from "@/lib/validations/me.query"
import { Listing } from "@/models/Listing"

export const runtime = "nodejs"

const sortMap = {
  newest: { createdAt: -1 as const },
  oldest: { createdAt: 1 as const },
  price_asc: { price: 1 as const },
  price_desc: { price: -1 as const },
}

/**
 * GET /api/me/listings — current user’s listings (all statuses).
 */
export async function GET(req: Request) {
  const gate = getAccessPayloadOrError(req)
  if (gate instanceof Response) return gate

  const { searchParams } = new URL(req.url)
  const raw: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    raw[key] = value
  })

  const parsed = myListingsQuerySchema.safeParse(raw)
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
    console.error("[api/me/listings]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const sellerId = new Types.ObjectId(gate.sub)
  const filter: Record<string, unknown> = { seller: sellerId }
  if (q.status) {
    filter.status = q.status
  }

  const sort = sortMap[q.sort] ?? sortMap.newest

  const [docs, total] = await Promise.all([
    Listing.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("seller", "name phone avatar location createdAt")
      .lean(),
    Listing.countDocuments(filter),
  ])

  const pages = Math.max(1, Math.ceil(total / limit))
  const listings = docs.map((doc) =>
    serializePublicListing(doc as unknown as Record<string, unknown>)
  )

  return successJson({
    listings,
    total,
    page,
    pages,
    limit,
    hasNext: page < pages,
    hasPrev: page > 1,
  })
}
