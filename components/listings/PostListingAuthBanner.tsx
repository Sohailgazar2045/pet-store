"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Shown on /listings/new when the user is not signed in — explains they can fill the form after login.
 */
export function PostListingAuthBanner() {
  const { ready, isAuthenticated } = useAuth()
  if (!ready || isAuthenticated) return null

  return (
    <div
      className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
      role="status"
    >
      <p className="font-medium">Sign in to upload photos and publish</p>
      <p className="mt-1 text-amber-900/90 dark:text-amber-200/90">
        You can review the form below. To submit, log in (or create an account) — we&apos;ll bring you
        back here.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/login?from=/listings/new"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Log in
        </Link>
        <Link
          href="/register"
          className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}
