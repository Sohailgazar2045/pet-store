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
      className="flex shrink-0 flex-row gap-1 overflow-x-auto pb-2 md:w-52 md:flex-col md:overflow-visible md:pb-0 md:pr-6"
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
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
