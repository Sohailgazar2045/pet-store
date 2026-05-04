import { connectDB } from "@/lib/db"
import { serializePublicListing } from "@/lib/listings/public-listings"
import { successJson, errorJson } from "@/lib/api-response"
import { requireAdminPayloadOrError } from "@/lib/request-auth"
import { adminListingsQuerySchema } from "@/lib/validations/admin-listing.query"
import { Listing } from "@/models/Listing"

export const runtime = "nodejs"

/**
 * GET /api/admin/listings — all listings with optional status filter & pagination.
 */
export async function GET(req: Request) {
  const admin = requireAdminPayloadOrError(req)
  if (admin instanceof Response) return admin

  const url = new URL(req.url)
  const raw: Record<string, string> = {}
  url.searchParams.forEach((v, k) => {
    raw[k] = v
  })

  const parsed = adminListingsQuerySchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid query"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  const { status, search, page, limit } = parsed.data
  const skip = (page - 1) * limit

  try {
    await connectDB()
  } catch (e) {
    console.error("[admin/listings]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const filter: Record<string, unknown> = {}
  if (status) filter.status = status
  if (search?.trim()) {
    filter.$text = { $search: search.trim() }
  }

  const [docs, total] = await Promise.all([
    Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("seller", "name email role createdAt")
      .lean(),
    Listing.countDocuments(filter),
  ])

  const listings = docs.map((d) =>
    serializePublicListing(d as unknown as Record<string, unknown>)
  )

  const pages = Math.max(1, Math.ceil(total / limit))

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
