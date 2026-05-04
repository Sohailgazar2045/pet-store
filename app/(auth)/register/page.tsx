import Link from "next/link"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Registration page — POST /api/auth/register with password rules.
 */
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-8 rounded-xl border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
          <p className="text-sm text-muted-foreground">
            Join PasturePro to post and chat with buyers and sellers.
          </p>
        </div>
        <RegisterForm />
        <div className="text-center">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost" }), "text-muted-foreground")}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
