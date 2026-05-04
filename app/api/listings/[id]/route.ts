import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import { deleteCloudinaryImagesIfOwned } from "@/lib/cloudinary"
import { getPublicListingById } from "@/lib/listings/get-public-by-id"
import { serializePublicListing } from "@/lib/listings/public-listings"
import { canManageListing } from "@/lib/listings/ownership"
import { successJson, errorJson } from "@/lib/api-response"
import {
  getAccessPayloadOrError,
  tryAccessPayload,
} from "@/lib/request-auth"
import { listingUpdateSchema } from "@/lib/validations/listing.schema"
import { Favorite } from "@/models/Favorite"
import { Listing } from "@/models/Listing"
import { Report } from "@/models/Report"

export const runtime = "nodejs"

/**
 * GET /api/listings/[id] — single listing (+ optional `isFavorited` when logged in).
 */
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    const listing = await getPublicListingById(id)
    if (!listing) {
      return errorJson("Listing not found", 404, "NOT_FOUND")
    }

    const user = tryAccessPayload(req)
    if (!user) {
      return successJson({ listing })
    }

    await connectDB()
    const favorited = await Favorite.exists({
      user: new Types.ObjectId(user.sub),
      listing: new Types.ObjectId(id),
    })

    return successJson({
      listing,
      isFavorited: !!favorited,
    })
  } catch (e) {
    console.error("[api/listings/[id] GET]", e)
    return errorJson("Failed to load listing", 500, "LISTING_ERROR")
  }
}

/**
 * PUT /api/listings/[id] — owner (or admin) partial update.
 */
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  const gate = getAccessPayloadOrError(req)
  if (gate instanceof Response) return gate

  const { id } = context.params
  if (!Types.ObjectId.isValid(id)) {
    return errorJson("Invalid listing id", 400, "INVALID_ID")
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorJson("Invalid JSON body", 400, "INVALID_JSON")
  }

  const parsed = listingUpdateSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Validation failed"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  const patch = parsed.data
  const keys = Object.keys(patch).filter(
    (k) => patch[k as keyof typeof patch] !== undefined
  )
  if (keys.length === 0) {
    return errorJson("No fields to update", 400, "EMPTY_UPDATE")
  }

  try {
    await connectDB()
  } catch (e) {
    console.error("[api/listings/[id] PUT]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const oid = new Types.ObjectId(id)
  const doc = await Listing.findById(oid)
  if (!doc) {
    return errorJson("Listing not found", 404, "NOT_FOUND")
  }

  if (!canManageListing(doc.seller, gate.sub, gate.role)) {
    return errorJson("You cannot edit this listing", 403, "FORBIDDEN")
  }

  if (patch.images) {
    const oldIds = (doc.images ?? []).map(
      (i: { public_id: string }) => i.public_id
    )
    const nextIds = new Set(
      patch.images.map((i: { public_id: string }) => i.public_id)
    )
    const removed = oldIds.filter((pid: string) => !nextIds.has(pid))
    await deleteCloudinaryImagesIfOwned(removed)
    doc.images = patch.images
  }

  if (patch.title !== undefined) doc.title = patch.title
  if (patch.description !== undefined) doc.description = patch.description
  if (patch.price !== undefined) doc.price = patch.price
  if (patch.category !== undefined) doc.category = patch.category
  if (patch.subcategory !== undefined) doc.subcategory = patch.subcategory
  if (patch.breed !== undefined) doc.breed = patch.breed
  if (patch.gender !== undefined) doc.gender = patch.gender
  if (patch.age !== undefined) doc.age = patch.age
  if (patch.tags !== undefined) doc.tags = patch.tags

  if (patch.status !== undefined) {
    if (patch.status !== "sold") {
      return errorJson("Invalid status", 400, "INVALID_STATUS")
    }
    if (doc.status !== "active") {
      return errorJson(
        "Only active listings can be marked as sold",
        400,
        "INVALID_TRANSITION"
      )
    }
    doc.status = "sold"
  }

  if (patch.location) {
    const cur = (
      doc.toObject?.() as { location?: Record<string, unknown> }
    ).location
    doc.set("location", {
      city: patch.location.city ?? (cur?.city as string | undefined),
      state: patch.location.state ?? (cur?.state as string | undefined),
      country:
        patch.location.country ??
        (cur?.country as string | undefined) ??
        "Pakistan",
      coordinates:
        patch.location.coordinates !== undefined
          ? patch.location.coordinates
          : (cur?.coordinates as { lat?: number; lng?: number } | undefined),
    })
  }

  await doc.save()

  const populated = await Listing.findById(oid)
    .populate("seller", "name phone avatar location createdAt")
    .lean()

  const listing = serializePublicListing(
    populated as unknown as Record<string, unknown>
  )

  return successJson({ listing })
}

/**
 * DELETE /api/listings/[id] — owner or admin; removes Cloudinary assets in app folder.
 */
export async function DELETE(
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
    console.error("[api/listings/[id] DELETE]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const oid = new Types.ObjectId(id)
  const doc = await Listing.findById(oid)
  if (!doc) {
    return errorJson("Listing not found", 404, "NOT_FOUND")
  }

  if (!canManageListing(doc.seller, gate.sub, gate.role)) {
    return errorJson("You cannot delete this listing", 403, "FORBIDDEN")
  }

  const publicIds = (doc.images ?? []).map(
    (i: { public_id: string }) => i.public_id
  )
  await deleteCloudinaryImagesIfOwned(publicIds)

  await Promise.all([
    Report.deleteMany({ listing: oid }),
    Favorite.deleteMany({ listing: oid }),
    doc.deleteOne(),
  ])

  return successJson({ deleted: true })
}
