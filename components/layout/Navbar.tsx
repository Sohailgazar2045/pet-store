"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { UserNav } from "./UserNav"
import { Search } from "lucide-react"

/**
 * Top navigation for the main (marketplace) section — reflects auth state from Zustand.
 */
export function Navbar() {
  const pathname = usePathname()
  const { ready, isAuthenticated, user } = useAuth()

  const navItems = [
    { name: "Listings", href: "/listings" },
    { name: "Post an Ad", href: "/listings/new" },
  ]

  if (ready && isAuthenticated) {
    navItems.push({ name: "Dashboard", href: "/dashboard" })
    if (user?.role === "admin") {
      navItems.push({ name: "Admin", href: "/admin" })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl transition-all group-hover:rotate-6 group-hover:scale-110 shadow-lg shadow-primary/30">
              P
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">
              Pasture<span className="text-primary">Pro</span>
            </span>
          </Link>
          
          <nav
            className="hidden lg:flex items-center gap-2"
            aria-label="Main"
          >
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href) && (item.href !== "/" || pathname === "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-black transition-all uppercase tracking-widest",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
             <input 
                type="text" 
                placeholder="Search assets..." 
                className="h-11 w-64 pl-10 pr-4 rounded-full bg-muted/50 border border-transparent focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
             />
          </div>

          <div className="flex items-center gap-3">
            {!ready ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-muted"></div>
            ) : isAuthenticated ? (
              <UserNav />
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:flex rounded-full px-6 font-black uppercase tracking-widest text-[10px]")}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: "sm" }), "rounded-full px-8 h-11 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20")}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
