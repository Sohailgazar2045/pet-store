import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import { Listing } from "@/models/Listing"
import { Report } from "@/models/Report"
import { successJson, errorJson } from "@/lib/api-response"
import { getAccessPayloadOrError } from "@/lib/request-auth"
import { reportCreateSchema } from "@/lib/validations/report.schema"

export const runtime = "nodejs"

/**
 * POST /api/listings/[id]/report — report a listing (one report per user per listing).
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

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorJson("Invalid JSON body", 400, "INVALID_JSON")
  }

  const parsed = reportCreateSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Validation failed"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  try {
    await connectDB()
  } catch (e) {
    console.error("[report]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const listingOid = new Types.ObjectId(id)
  const listing = await Listing.findById(listingOid).select("seller").lean()
  if (!listing) {
    return errorJson("Listing not found", 404, "NOT_FOUND")
  }

  if (String(listing.seller) === gate.sub) {
    return errorJson("You cannot report your own listing", 400, "INVALID_REPORT")
  }

  const dup = await Report.exists({
    reporter: new Types.ObjectId(gate.sub),
    listing: listingOid,
  })
  if (dup) {
    return errorJson("You have already reported this listing", 409, "DUPLICATE_REPORT")
  }

  await Report.create({
    reporter: new Types.ObjectId(gate.sub),
    listing: listingOid,
    reason: parsed.data.reason,
    description: parsed.data.description,
    status: "pending",
  })

  return successJson({ reported: true }, 201)
}
