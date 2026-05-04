import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import { deleteCloudinaryImagesIfOwned } from "@/lib/cloudinary"
import { serializePublicListing } from "@/lib/listings/public-listings"
import { successJson, errorJson } from "@/lib/api-response"
import { requireAdminPayloadOrError } from "@/lib/request-auth"
import { adminListingStatusSchema } from "@/lib/validations/listing.schema"
import { Favorite } from "@/models/Favorite"
import { Listing } from "@/models/Listing"
import { Report } from "@/models/Report"

export const runtime = "nodejs"

/**
 * PUT /api/admin/listings/[id] — set listing status (approve / reject / etc.).
 */
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  const admin = requireAdminPayloadOrError(req)
  if (admin instanceof Response) return admin

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

  const parsed = adminListingStatusSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Validation failed"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  try {
    await connectDB()
  } catch (e) {
    console.error("[admin/listings PUT]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const oid = new Types.ObjectId(id)
  const updated = await Listing.findByIdAndUpdate(
    oid,
    { status: parsed.data.status },
    { new: true, runValidators: true }
  )
    .populate("seller", "name phone avatar location createdAt")
    .lean()

  if (!updated) {
    return errorJson("Listing not found", 404, "NOT_FOUND")
  }

  const listing = serializePublicListing(
    updated as unknown as Record<string, unknown>
  )

  return successJson({ listing })
}

/**
 * DELETE /api/admin/listings/[id] — hard-delete listing and related data.
 */
export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  const admin = requireAdminPayloadOrError(_req)
  if (admin instanceof Response) return admin

  const { id } = context.params
  if (!Types.ObjectId.isValid(id)) {
    return errorJson("Invalid listing id", 400, "INVALID_ID")
  }

  try {
    await connectDB()
  } catch (e) {
    console.error("[admin/listings DELETE]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const oid = new Types.ObjectId(id)
  const doc = await Listing.findById(oid)
  if (!doc) {
    return errorJson("Listing not found", 404, "NOT_FOUND")
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
