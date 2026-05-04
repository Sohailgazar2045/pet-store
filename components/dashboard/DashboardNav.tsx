"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Heart,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

const links: {
  href: string
  label: string
  icon: typeof LayoutDashboard
  exact?: boolean
}[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/listings", label: "My listings", icon: ListChecks },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/profile", label: "Profile", icon: User },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav
      className="flex shrink-0 flex-row gap-2 overflow-x-auto pb-4 md:w-60 md:flex-col md:overflow-visible md:pb-0 md:pr-8"
      aria-label="Dashboard"
    >
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition-all",
              active
                ? "bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className={cn("size-5 shrink-0", active ? "opacity-100" : "opacity-60")} aria-hidden />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
