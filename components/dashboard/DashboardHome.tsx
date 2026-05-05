"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Heart, ListChecks, Plus, TrendingUp, ShoppingBag, Clock, BarChart3 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { apiGet } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

type StatsPayload = {
  listingsTotal: number
  listingsByStatus: {
    pending: number
    active: number
    sold: number
    rejected: number
  }
  favorites: number
}

export function DashboardHome() {
  const { accessToken, user } = useAuth()

  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await apiGet<StatsPayload>("/api/me/stats", {
        token: accessToken,
      })
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    enabled: Boolean(accessToken),
  })

  if (isPending || !accessToken) {
    return (
      <div className="space-y-10">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="glass p-12 rounded-[2.5rem] border-rose-200 bg-rose-50/50 text-center">
        <p className="text-rose-600 font-bold">Could not load dashboard stats. Please try again.</p>
      </div>
    )
  }

  const { listingsTotal, listingsByStatus, favorites } = data

  const stats = [
    { label: "Total Listings", value: listingsTotal, icon: ListChecks, color: "text-primary", bg: "bg-primary/10", href: "/dashboard/listings" },
    { label: "Active Ads", value: listingsByStatus.active, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Saved Items", value: favorites, icon: Heart, color: "text-rose-500", bg: "bg-rose-50", href: "/dashboard/favorites" },
    { label: "Pending", value: listingsByStatus.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" }
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Welcome back, <span className="text-gradient">{user?.name}</span></h1>
          <p className="mt-2 text-lg text-muted-foreground font-medium">
            Here's what's happening with your marketplace activity.
          </p>
        </div>
        <Link
          href="/listings/new"
          className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all")}
        >
          <Plus className="mr-2 size-5" />
          Create New Listing
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass p-8 rounded-[2.5rem] border-white/40 shadow-xl group hover:-translate-y-1 transition-all">
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm", stat.bg, stat.color)}>
              <stat.icon className="size-6" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</p>
               <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-black">{stat.value}</h3>
                  {stat.href && (
                    <Link href={stat.href} className="text-xs font-black text-primary hover:underline">View All</Link>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
         <div className="lg:col-span-8 space-y-6">
            <div className="glass p-10 rounded-[3rem] border-white/40 shadow-xl h-full">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                     <TrendingUp className="size-6 text-primary" />
                     Performance Insights
                  </h3>
                  <Badge variant="outline" className="px-3 py-1 font-bold">Last 30 Days</Badge>
               </div>
               <div className="h-64 w-full flex items-center justify-center border-2 border-dashed border-muted rounded-[2rem]">
                  <div className="text-center text-muted-foreground">
                     <BarChart3 className="size-12 mx-auto mb-4 opacity-20" />
                     <p className="font-bold">Analytics visualization coming soon</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="glass p-8 rounded-[3rem] border-white/40 shadow-xl bg-primary text-white">
               <h3 className="text-xl font-black mb-4">Elite Seller Status</h3>
               <p className="text-primary-foreground/90 font-medium mb-8 leading-relaxed">Upgrade to Elite to get lower transaction fees and priority listing placement.</p>
               <button className="w-full h-14 bg-white text-primary rounded-full font-black hover:scale-105 transition-all shadow-2xl">
                  Upgrade Now
               </button>
            </div>

            <div className="glass p-8 rounded-[3rem] border-white/40 shadow-xl">
               <h4 className="text-lg font-black mb-6 flex items-center gap-2">
                  <ShoppingBag className="size-5 text-primary" />
                  Quick Actions
               </h4>
               <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: "Browse Market", href: "/listings" },
                    { label: "My Profile", href: "/dashboard/profile" },
                    { label: "Help Center", href: "/help" }
                  ].map(action => (
                    <Link 
                      key={action.label}
                      href={action.href}
                      className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group"
                    >
                      <span className="font-bold text-muted-foreground group-hover:text-primary">{action.label}</span>
                      <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

