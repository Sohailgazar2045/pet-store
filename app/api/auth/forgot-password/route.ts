import crypto from "node:crypto"
import { connectDB } from "@/lib/db"
import { successJson, errorJson } from "@/lib/api-response"
import { forgotPasswordSchema } from "@/lib/validations/password-reset.schema"
import { User } from "@/models/User"
import { sendPasswordResetEmail } from "@/lib/email"

export const runtime = "nodejs"

const RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000 // 1 hour

/**
 * POST /api/auth/forgot-password — send a password reset email.
 * Always returns 200 to prevent email enumeration.
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorJson("Invalid JSON body", 400, "INVALID_JSON")
  }

  const parsed = forgotPasswordSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Validation failed"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  const { email } = parsed.data

  try {
    await connectDB()
  } catch (e) {
    console.error("[auth/forgot-password] DB error", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const user = await User.findOne({ email: email.toLowerCase() })

  // Always return success to prevent email enumeration
  if (!user || user.isBanned) {
    return successJson({ message: "If that email exists you will receive a reset link." })
  }

  // Generate a secure random token
  const rawToken = crypto.randomBytes(32).toString("hex")
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")

  user.passwordResetToken = hashedToken
  user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_EXPIRES_MS)
  await user.save()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const resetUrl = `${appUrl}/reset-password?token=${rawToken}`

  try {
    await sendPasswordResetEmail(user.email, resetUrl)
  } catch (e) {
    console.error("[auth/forgot-password] email send failed", e)
    // Clear the token so the user can retry
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    return errorJson("Failed to send reset email. Please try again later.", 500, "EMAIL_FAILED")
  }

  return successJson({ message: "If that email exists you will receive a reset link." })
}
