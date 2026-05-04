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
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold transition-transform group-hover:rotate-12">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Pasture<span className="text-primary">Pro</span>
            </span>
          </Link>
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main"
          >
            {[
              { name: "Listings", href: "/listings" },
              { name: "Post an Ad", href: "/listings/new" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
            {ready && isAuthenticated ? (
              <Link
                href="/dashboard"
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
              >
                Dashboard
              </Link>
            ) : null}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {!ready ? (
            <div className="h-8 w-24 animate-pulse rounded-full bg-muted"></div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-sm font-medium text-muted-foreground lg:inline">
                Hi, {user?.name?.split(' ')[0] ?? "User"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => void logout()}
              >
                Log out
              </Button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full px-6")}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "sm" }), "rounded-full px-6 shadow-lg shadow-primary/20")}
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
