import { cookies } from "next/headers"
import { connectDB } from "@/lib/db"
import {
  hashPassword,
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth"
import { successJson, errorJson } from "@/lib/api-response"
import {
  ACCESS_COOKIE_MAX_AGE_SEC,
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_MAX_AGE_SEC,
  REFRESH_COOKIE_NAME,
} from "@/lib/auth-cookies"
import { registerSchema } from "@/lib/validations/auth.schema"
import { User } from "@/models/User"
import { toSafeUser } from "@/lib/user-serialize"
import type { UserRole } from "@/types"

export const runtime = "nodejs"

/**
 * POST /api/auth/register — create account, set refresh cookie, return access token.
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorJson("Invalid JSON body", 400, "INVALID_JSON")
  }

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Validation failed"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  const data = parsed.data

  try {
    await connectDB()
  } catch (e) {
    console.error("[auth/register] DB connection failed", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const existing = await User.findOne({ email: data.email })
  if (existing) {
    return errorJson("An account with this email already exists", 409, "EMAIL_EXISTS")
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const role: UserRole =
    adminEmail && data.email.toLowerCase() === adminEmail ? "admin" : "user"

  const passwordHash = await hashPassword(data.password)
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: passwordHash,
    phone: data.phone,
    location: data.location,
    role,
  })

  const accessToken = signAccessToken(user._id.toString(), user.role)
  const refreshToken = signRefreshToken(user._id.toString())
  const refreshHash = hashRefreshToken(refreshToken)

  user.refreshTokens = [refreshHash]
  await user.save()

  const cookieStore = await cookies()
  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE_SEC,
  })
  cookieStore.set(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE_SEC,
  })

  const userDoc = user.toObject()
  return successJson({
    user: toSafeUser(userDoc),
    accessToken,
  }, 201)
}
