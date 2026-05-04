"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

type AuthGuardProps = {
  children: React.ReactNode
  /** Where to send unauthenticated users (default `/login`). */
  loginHref?: string
}

/**
 * Renders `children` only when the user is signed in; otherwise redirects to login.
 */
export function AuthGuard({ children, loginHref = "/login" }: AuthGuardProps) {
  const router = useRouter()
  const { ready, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!ready) return
    if (!isAuthenticated) {
      router.replace(loginHref)
    }
  }, [ready, isAuthenticated, router, loginHref])

  if (!ready || !isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Checking session…
      </div>
    )
  }

  return <>{children}</>
}
