import nodemailer from "nodemailer"

function createTransporter() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS must be set to send email")
  }

  const port = Number(process.env.SMTP_PORT) || 587
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

const APP_NAME = "PasturePro"

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<void> {
  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Reset your ${APP_NAME} password`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="margin-bottom:8px">Reset your password</h2>
        <p style="color:#555;margin-bottom:24px">
          We received a request to reset the password for your ${APP_NAME} account.
          Click the button below — this link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 28px;background:#2563eb;color:#fff;
                  text-decoration:none;border-radius:8px;font-weight:600">
          Reset Password
        </a>
        <p style="color:#888;font-size:13px;margin-top:32px">
          If you did not request a password reset, you can safely ignore this email.
          Your password will not change.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin-top:32px"/>
        <p style="color:#aaa;font-size:12px">${APP_NAME} — Livestock &amp; Pet Marketplace</p>
      </div>
    `,
  })
}
