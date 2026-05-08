"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Heart,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  User,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const links: {
  href: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
}[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/listings", label: "My Inventory", icon: ListChecks },
  { href: "/dashboard/favorites", label: "Saved Assets", icon: Heart },
  { href: "/dashboard/messages", label: "Messenger", icon: MessageSquare },
  { href: "/dashboard/profile", label: "Account Settings", icon: User },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav
      className="flex shrink-0 flex-row gap-2 overflow-x-auto pb-6 md:w-72 md:flex-col md:overflow-visible md:pb-0 md:pr-10"
      aria-label="Dashboard"
    >
      <div className="mb-6 hidden md:block px-4">
         <p className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Trading Hub</p>
      </div>
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center justify-between rounded-2xl px-5 py-4 text-[13px] font-black transition-all group",
              active
                ? "bg-primary text-white shadow-[0_20px_40px_-12px_rgba(var(--primary),0.3)] scale-[1.02]"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-4">
               <Icon className={cn("size-5 shrink-0", active ? "opacity-100" : "opacity-50 group-hover:opacity-100 transition-opacity")} aria-hidden />
               {label}
            </div>
            {active && <ChevronRight className="size-4 animate-in fade-in slide-in-from-left-2 duration-300" />}
          </Link>
        )
      })}
    </nav>
  )
}

