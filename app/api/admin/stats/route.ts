import { connectDB } from "@/lib/db"
import { successJson, errorJson } from "@/lib/api-response"
import { requireAdminPayloadOrError } from "@/lib/request-auth"
import { User } from "@/models/User"
import { Listing } from "@/models/Listing"
import { Report } from "@/models/Report"
import { Message } from "@/models/Message"

export const runtime = "nodejs"

/**
 * GET /api/admin/stats — top-level operational metrics for admin dashboard.
 */
export async function GET(req: Request) {
  const gate = requireAdminPayloadOrError(req)
  if (gate instanceof Response) return gate

  try {
    await connectDB()
  } catch (e) {
    console.error("[admin/stats]", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const [usersTotal, usersVerified, usersBanned, listingsTotal, listingsPending, reportsPending, messages24h] =
    await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isBanned: true }),
      Listing.countDocuments({}),
      Listing.countDocuments({ status: "pending" }),
      Report.countDocuments({ status: "pending" }),
      Message.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    ])

  const verificationRate =
    usersTotal > 0 ? Number(((usersVerified / usersTotal) * 100).toFixed(1)) : 0

  return successJson({
    usersTotal,
    usersVerified,
    usersBanned,
    listingsTotal,
    listingsPending,
    reportsPending,
    messages24h,
    verificationRate,
  })
}
