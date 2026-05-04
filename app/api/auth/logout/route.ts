import { cookies } from "next/headers"
import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import { hashRefreshToken, verifyRefreshToken } from "@/lib/auth"
import { successJson } from "@/lib/api-response"
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/lib/auth-cookies"
import { removeRefreshTokenHash } from "@/lib/refresh-token-store"

export const runtime = "nodejs"

/**
 * POST /api/auth/logout — invalidate refresh token server-side and clear cookie.
 */
export async function POST() {
  const cookieStore = await cookies()
  const refreshCookie = cookieStore.get(REFRESH_COOKIE_NAME)?.value

  cookieStore.set(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  cookieStore.set(ACCESS_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  if (!refreshCookie) {
    return successJson({ ok: true })
  }

  try {
    const payload = verifyRefreshToken(refreshCookie)
    await connectDB()
    const hash = hashRefreshToken(refreshCookie)
    await removeRefreshTokenHash(new Types.ObjectId(payload.sub), hash)
  } catch {
    /* invalid or expired token — cookie already cleared */
  }

  return successJson({ ok: true })
}
