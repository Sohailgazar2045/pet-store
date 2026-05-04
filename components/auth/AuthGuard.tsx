"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

type AuthGuardProps = {
  children: React.ReactNode
  /** Base login path (default `/login`); current path is appended as `from`. */
  loginHref?: string
}

/**
 * Renders `children` only when the user is signed in; otherwise redirects to login.
 */
export function AuthGuard({ children, loginHref = "/login" }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { ready, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!ready) return
    if (!isAuthenticated) {
      const base = loginHref.split("?")[0] ?? "/login"
      const search = new URLSearchParams()
      search.set("from", pathname)
      const qs = search.toString()
      router.replace(qs ? `${base}?${qs}` : base)
    }
  }, [ready, isAuthenticated, router, loginHref, pathname])

  if (!ready || !isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Checking session…
      </div>
    )
  }

  return <>{children}</>
}
