import { cookies } from "next/headers"
import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import {
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth"
import { successJson, errorJson } from "@/lib/api-response"
import {
  ACCESS_COOKIE_MAX_AGE_SEC,
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_MAX_AGE_SEC,
  REFRESH_COOKIE_NAME,
} from "@/lib/auth-cookies"
import { User } from "@/models/User"
import {
  hasRefreshTokenHash,
  removeRefreshTokenHash,
  storeRefreshTokenHash,
} from "@/lib/refresh-token-store"

export const runtime = "nodejs"

/**
 * POST /api/auth/refresh — rotate the refresh token and issue a new access token.
 * The old refresh token is invalidated on use (token rotation).
 */
export async function POST() {
  const jar = await cookies()
  const refreshCookie = jar.get(REFRESH_COOKIE_NAME)?.value

  if (!refreshCookie) {
    return errorJson("Missing refresh token", 401, "NO_REFRESH")
  }

  let payload: { sub: string }
  try {
    payload = verifyRefreshToken(refreshCookie)
  } catch {
    return errorJson("Invalid or expired refresh token", 401, "INVALID_REFRESH")
  }

  const oldHash = hashRefreshToken(refreshCookie)

  try {
    await connectDB()
  } catch (e) {
    console.error("[auth/refresh] DB connection failed", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const id = new Types.ObjectId(payload.sub)
  const valid = await hasRefreshTokenHash(id, oldHash)
  if (!valid) {
    return errorJson("Refresh token revoked", 401, "REVOKED_REFRESH")
  }

  const user = await User.findById(id)
  if (!user || user.isBanned) {
    return errorJson("Unauthorized", 401, "UNAUTHORIZED")
  }

  // Rotate: remove old hash, issue new refresh token
  await removeRefreshTokenHash(id, oldHash)

  const newRefreshToken = signRefreshToken(user._id.toString())
  const newRefreshHash = hashRefreshToken(newRefreshToken)
  await storeRefreshTokenHash(id, newRefreshHash)

  const accessToken = signAccessToken(user._id.toString(), user.role)

  jar.set(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE_SEC,
  })

  jar.set(REFRESH_COOKIE_NAME, newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE_SEC,
  })

  return successJson({ accessToken })
}
