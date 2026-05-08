"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Heart, Loader2, Search } from "lucide-react"
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
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="size-10 animate-spin text-primary" />
           <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Loading Collection...</p>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="glass p-12 rounded-[2.5rem] border-rose-200 bg-rose-50/50 text-center">
        <p className="text-rose-600 font-bold mb-4">Could not load your favorites.</p>
        <Button
          variant="outline"
          className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-100"
          onClick={() => void refetch()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  const listings = data.items.map((i) => i.listing)
  const { pages, hasNext, hasPrev, total } = data

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Saved <span className="text-gradient">Listings</span></h1>
          <p className="mt-2 text-lg text-muted-foreground font-medium">
            {total === 0
              ? "You haven’t saved any listings yet."
              : `You have ${total} saved asset${total === 1 ? "" : "s"} in your collection.`}
          </p>
        </div>
        {total > 0 && (
           <Link href="/listings" className="text-xs font-black uppercase tracking-widest text-primary hover:underline">
              Browse More →
           </Link>
        )}
      </div>

      {listings.length === 0 ? (
        <div className="glass p-20 text-center rounded-[3rem] border-dashed border-white/40 shadow-inner">
           <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="size-10 text-muted-foreground/30" />
           </div>
           <h3 className="text-2xl font-black mb-4">Your collection is empty</h3>
           <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-10 leading-relaxed">
             Start exploring the marketplace and save the assets you&apos;re interested in by clicking the heart icon.
           </p>
           <Link 
             href="/listings" 
             className="inline-flex items-center gap-2 h-14 px-10 rounded-full bg-primary text-white font-black hover:scale-105 transition-all shadow-xl shadow-primary/20"
           >
             <Search className="size-5" />
             Explore Marketplace
           </Link>
        </div>
      ) : (
        <ListingGrid listings={listings} />
      )}

      {pages > 1 ? (
        <div className="flex items-center justify-center gap-6 pt-10 border-t border-white/20">
          <Button
            type="button"
            variant="outline"
            className="rounded-full h-12 px-8 font-black border-2"
            disabled={!hasPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
             <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Page</span>
             <span className="h-10 w-10 flex items-center justify-center bg-primary text-white rounded-full font-black text-sm shadow-lg shadow-primary/20">{page}</span>
             <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">of {pages}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-full h-12 px-8 font-black border-2"
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

