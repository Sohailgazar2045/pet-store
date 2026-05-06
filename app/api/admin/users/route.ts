import { connectDB } from "@/lib/db"
import { successJson, errorJson } from "@/lib/api-response"
import { requireAdminPayloadOrError } from "@/lib/request-auth"
import { User } from "@/models/User"

export const runtime = "nodejs"

/**
 * GET /api/admin/users — list users for admin matrix.
 */
export async function GET(req: Request) {
  const gate = requireAdminPayloadOrError(req)
  if (gate instanceof Response) return gate

  try {
    await connectDB()
  } catch (e) {
    console.error("[admin/users:get]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const docs = await User.find({})
    .sort({ createdAt: -1 })
    .select("_id name email role isVerified isBanned createdAt")
    .lean()

  return successJson({
    users: docs.map((u) => ({
      _id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role,
      isVerified: Boolean(u.isVerified),
      isBanned: Boolean(u.isBanned),
      createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
    })),
  })
}
