import crypto from "node:crypto"
import { connectDB } from "@/lib/db"
import { successJson, errorJson } from "@/lib/api-response"
import { resetPasswordSchema } from "@/lib/validations/password-reset.schema"
import { User } from "@/models/User"
import { hashPassword } from "@/lib/auth"

export const runtime = "nodejs"

/**
 * POST /api/auth/reset-password — verify reset token and update the password.
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorJson("Invalid JSON body", 400, "INVALID_JSON")
  }

  const parsed = resetPasswordSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Validation failed"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  const { token, password } = parsed.data

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

  try {
    await connectDB()
  } catch (e) {
    console.error("[auth/reset-password] DB error", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetToken +passwordResetExpires +password")

  if (!user) {
    return errorJson("Reset link is invalid or has expired.", 400, "INVALID_RESET_TOKEN")
  }

  user.password = await hashPassword(password)
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  // Invalidate all refresh tokens so existing sessions are logged out
  user.refreshTokens = []
  await user.save()

  return successJson({ message: "Password updated successfully. Please log in." })
}
