import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import { queryPublicListings, serializePublicListing } from "@/lib/listings/public-listings"
import { successJson, errorJson } from "@/lib/api-response"
import { getAccessPayloadOrError } from "@/lib/request-auth"
import { listingsQuerySchema } from "@/lib/validations/listing.query"
import { listingCreateSchema } from "@/lib/validations/listing.schema"
import { Listing } from "@/models/Listing"

export const runtime = "nodejs"

/**
 * POST /api/listings — create listing (pending until admin approves).
 */
export async function POST(req: Request) {
  const gate = getAccessPayloadOrError(req)
  if (gate instanceof Response) return gate

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorJson("Invalid JSON body", 400, "INVALID_JSON")
  }

  const parsed = listingCreateSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Validation failed"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  const data = parsed.data

  try {
    await connectDB()
  } catch (e) {
    console.error("[api/listings POST] DB", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const listing = await Listing.create({
    title: data.title,
    description: data.description,
    price: data.price,
    category: data.category,
    subcategory: data.subcategory,
    breed: data.breed,
    age: data.age,
    gender: data.gender,
    images: data.images,
    location: {
      city: data.location.city,
      state: data.location.state,
      country: data.location.country ?? "Pakistan",
      coordinates: data.location.coordinates,
    },
    seller: new Types.ObjectId(gate.sub),
    status: "pending",
    views: 0,
    isFeatured: false,
    tags: data.tags ?? [],
  })

  const populated = await Listing.findById(listing._id)
    .populate("seller", "name phone avatar location createdAt")
    .lean()

  if (!populated) {
    return errorJson("Failed to load created listing", 500, "CREATE_LOAD_FAILED")
  }

  const publicListing = serializePublicListing(
    populated as unknown as Record<string, unknown>
  )

  return successJson({ listing: publicListing }, 201)
}

/**
 * GET /api/listings — browse active listings with filters and pagination.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const raw: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    raw[key] = value
  })

  const parsed = listingsQuerySchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid query"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  try {
    const data = await queryPublicListings(parsed.data)
    return successJson(data)
  } catch (e) {
    console.error("[api/listings GET]", e)
    return errorJson("Failed to load listings", 500, "LISTINGS_ERROR")
  }
}
