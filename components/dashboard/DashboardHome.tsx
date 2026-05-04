"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Heart, ListChecks, Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
  const { accessToken } = useAuth()

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
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Could not load dashboard stats. Refresh the page or try again later.
      </p>
    )
  }

  const { listingsTotal, listingsByStatus, favorites } = data

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your listings, saved ads, and profile.
          </p>
        </div>
        <Link
          href="/listings/new"
          className={cn(buttonVariants(), "inline-flex items-center gap-2")}
        >
          <Plus className="size-4" />
          Post an ad
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total listings</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{listingsTotal}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/listings"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl tabular-nums text-green-700 dark:text-green-400">
              {listingsByStatus.active}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Live on the marketplace
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending review</CardDescription>
            <CardTitle className="text-3xl tabular-nums text-amber-700 dark:text-amber-400">
              {listingsByStatus.pending}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Waiting for admin approval
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Saved ads</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl tabular-nums">
              {favorites}
              <Heart className="size-5 text-rose-500" aria-hidden />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/favorites"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Open favorites
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="size-5" />
              Listing status
            </CardTitle>
            <CardDescription>Counts by moderation and sale state</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              <li className="rounded-lg border bg-muted/40 px-3 py-2">
                <span className="text-muted-foreground">Sold</span>
                <span className="ml-2 font-semibold tabular-nums">
                  {listingsByStatus.sold}
                </span>
              </li>
              <li className="rounded-lg border bg-muted/40 px-3 py-2">
                <span className="text-muted-foreground">Rejected</span>
                <span className="ml-2 font-semibold tabular-nums">
                  {listingsByStatus.rejected}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link
              href="/listings"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Browse marketplace
            </Link>
            <Link
              href="/dashboard/profile"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Edit profile
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
