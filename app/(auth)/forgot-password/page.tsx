import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Forgot-password placeholder (email reset implemented later). */
export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-xl font-semibold">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          Password reset flow will use email (Nodemailer) in a later step.
        </p>
        <Link href="/login" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to login
        </Link>
      </div>
    </div>
  )
}
