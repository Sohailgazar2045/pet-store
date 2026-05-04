import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import { verifyAccessToken } from "@/lib/auth"
import { successJson, errorJson } from "@/lib/api-response"
import { User } from "@/models/User"
import { toSafeUser } from "@/lib/user-serialize"

export const runtime = "nodejs"

/**
 * Extracts Bearer token from Authorization header.
 */
function getBearerToken(req: Request): string | null {
  const h = req.headers.get("authorization")
  if (!h?.startsWith("Bearer ")) return null
  return h.slice(7).trim() || null
}

/**
 * GET /api/auth/me — current user from access token.
 */
export async function GET(req: Request) {
  const token = getBearerToken(req)
  if (!token) {
    return errorJson("Missing or invalid authorization", 401, "NO_TOKEN")
  }

  let payload: ReturnType<typeof verifyAccessToken>
  try {
    payload = verifyAccessToken(token)
  } catch {
    return errorJson("Invalid or expired access token", 401, "INVALID_TOKEN")
  }

  try {
    await connectDB()
  } catch (e) {
    console.error("[auth/me] DB connection failed", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const user = await User.findById(new Types.ObjectId(payload.sub))
  if (!user) {
    return errorJson("User not found", 404, "NOT_FOUND")
  }

  return successJson({ user: toSafeUser(user.toObject()) })
}
