"use client"

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

/**
 * Top navigation for the main (marketplace) section — reflects auth state from Zustand.
 */
export function Navbar() {
  const { ready, isAuthenticated, user, logout } = useAuth()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <Link
            href="/"
            className="shrink-0 text-lg font-bold tracking-tight text-primary"
          >
            PasturePro
          </Link>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
            <Link
              href="/listings"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Listings
            </Link>
            <Link
              href="/listings/new"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Post an ad
            </Link>
            {ready && isAuthenticated ? (
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Dashboard
              </Link>
            ) : null}
            {ready && user?.role === "admin" ? (
              <Link
                href="/admin"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Admin
              </Link>
            ) : null}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!ready ? (
            <span className="text-xs text-muted-foreground" aria-hidden>
              …
            </span>
          ) : isAuthenticated ? (
            <>
              <span className="hidden max-w-[140px] truncate text-sm text-muted-foreground sm:inline">
                {user?.name ?? user?.email}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void logout()}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
