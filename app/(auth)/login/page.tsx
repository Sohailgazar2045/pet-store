import { Suspense } from "react"
import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Login page — form submits to POST /api/auth/login.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-8 rounded-xl border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Log in</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage listings and messages.
          </p>
        </div>
        <Suspense
          fallback={
            <p className="text-center text-sm text-muted-foreground">
              Loading form…
            </p>
          }
        >
          <LoginForm />
        </Suspense>
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
