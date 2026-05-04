"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { ListingGrid } from "@/components/listings/ListingGrid"
import { Button } from "@/components/ui/button"
import type { PublicListing } from "@/lib/listings/public-listings"
import { apiGet } from "@/lib/api-client"
import { useAuth } from "@/hooks/useAuth"

type FavoritesPayload = {
  items: { favoritedAt: string; listing: PublicListing }[]
  total: number
  page: number
  pages: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export function FavoritesPanel() {
  const { accessToken } = useAuth()
  const [page, setPage] = useState(1)

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["my-favorites", page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
      })
      const res = await apiGet<FavoritesPayload>(
        `/api/me/favorites?${params}`,
        { token: accessToken }
      )
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    enabled: Boolean(accessToken),
  })

  if (isPending && !data) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Could not load favorites.{" "}
        <button
          type="button"
          className="underline"
          onClick={() => void refetch()}
        >
          Retry
        </button>
      </p>
    )
  }

  const listings = data.items.map((i) => i.listing)
  const { pages, hasNext, hasPrev, total } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved listings</h1>
        <p className="mt-1 text-muted-foreground">
          {total === 0
            ? "You haven’t saved any listings yet."
            : `${total} saved listing${total === 1 ? "" : "s"}`}
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Browse the marketplace and tap the heart on a listing when we add it — for now, explore{" "}
          <Link href="/listings" className="font-medium text-primary underline">
            active listings
          </Link>
          .
        </div>
      ) : (
        <ListingGrid listings={listings} />
      )}

      {pages > 1 ? (
        <div className="flex items-center justify-center gap-2 text-sm">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!hasPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-muted-foreground">
            Page {page} of {pages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  )
}
