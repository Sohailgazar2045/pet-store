import { cookies } from "next/headers"
import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import {
  comparePassword,
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
import { loginSchema } from "@/lib/validations/auth.schema"
import { User } from "@/models/User"
import { toSafeUser } from "@/lib/user-serialize"
import { storeRefreshTokenHash } from "@/lib/refresh-token-store"

export const runtime = "nodejs"

/**
 * POST /api/auth/login — verify credentials, set refresh cookie, return access token.
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorJson("Invalid JSON body", 400, "INVALID_JSON")
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Validation failed"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  const { email, password } = parsed.data

  try {
    await connectDB()
  } catch (e) {
    console.error("[auth/login] DB connection failed", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const user = await User.findOne({ email }).select("+password")
  if (!user || !(await comparePassword(password, user.password))) {
    return errorJson("Invalid email or password", 401, "INVALID_CREDENTIALS")
  }

  if (user.isBanned) {
    return errorJson("This account has been suspended", 403, "BANNED")
  }

  const accessToken = signAccessToken(user._id.toString(), user.role)
  const refreshToken = signRefreshToken(user._id.toString())
  const refreshHash = hashRefreshToken(refreshToken)
  await storeRefreshTokenHash(new Types.ObjectId(user._id), refreshHash)

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

  const lean = user.toObject()
  delete (lean as { password?: string }).password

  return successJson({
    user: toSafeUser(lean),
    accessToken,
  })
}
