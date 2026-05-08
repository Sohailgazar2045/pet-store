"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { UserNav } from "./UserNav"
import { Search, Heart, PlusCircle, LayoutDashboard } from "lucide-react"

/**
 * Top navigation for the main (marketplace) section — reflects auth state from Zustand.
 */
export function Navbar() {
  const pathname = usePathname()
  const { ready, isAuthenticated } = useAuth()

  const navItems = [
    { name: "Marketplace", href: "/listings", icon: null },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-black text-2xl transition-all group-hover:rotate-6 group-hover:scale-110 shadow-[0_10px_20px_rgba(var(--primary),0.3)]">
              P
            </div>
            <span className="text-2xl font-black tracking-tighter text-foreground hidden sm:block">
              Pasture<span className="text-primary">Pro</span>
            </span>
          </Link>
          
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main"
          >
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href) && (item.href !== "/" || pathname === "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "rounded-full px-6 py-2.5 text-[13px] font-black transition-all uppercase tracking-widest",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
            
            {ready && isAuthenticated && (
               <Link
                  href="/dashboard"
                  className={cn(
                    "rounded-full px-6 py-2.5 text-[13px] font-black transition-all uppercase tracking-widest flex items-center gap-2",
                    pathname.startsWith("/dashboard") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
               >
                  <LayoutDashboard className="size-4" />
                  Dashboard
               </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
             <input 
                type="text" 
                placeholder="Search premium assets..." 
                className="h-11 w-72 pl-12 pr-4 rounded-full bg-muted/40 border border-transparent focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none text-sm font-semibold transition-all shadow-inner"
             />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {ready && isAuthenticated && (
               <Link href="/dashboard/favorites" className="h-11 w-11 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary transition-all relative">
                  <Heart className="size-5 font-black" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-background"></span>
               </Link>
            )}

            {!ready ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-muted"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                 <Link
                    href="/listings/new"
                    className={cn(buttonVariants({ size: "sm" }), "hidden sm:flex rounded-full px-6 h-11 font-black uppercase tracking-widest text-[11px] gap-2 shadow-xl shadow-primary/20")}
                 >
                    <PlusCircle className="size-4" />
                    Post Ad
                 </Link>
                 <UserNav />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:flex rounded-full px-6 h-11 font-black uppercase tracking-widest text-[11px]")}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: "sm" }), "rounded-full px-8 h-11 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20")}
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

