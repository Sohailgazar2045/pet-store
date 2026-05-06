"use client"

import Image from "next/image"
import Link from "next/link"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2, Trash2, Eye, Plus, ExternalLink, CheckCircle2, MoreVertical, ShoppingBag } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiDelete, apiGet, apiPut } from "@/lib/api-client"
import type { PublicListing } from "@/lib/listings/public-listings"
import { cn, formatListingPrice } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import type { ListingStatus } from "@/types"

type ListingsPayload = {
  listings: PublicListing[]
  total: number
  page: number
  pages: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

function statusBadgeClass(status: ListingStatus) {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    case "pending":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20"
    case "sold":
      return "bg-slate-500/10 text-slate-600 border-slate-500/20"
    case "rejected":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20"
    default:
      return ""
  }
}

export function MyListingsPanel() {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const queryKey = useMemo(
    () => ["my-listings", page, statusFilter] as const,
    [page, statusFilter]
  )

  const { data, isPending, isError, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        sort: "newest",
      })
      if (statusFilter !== "all") {
        params.set("status", statusFilter)
      }
      const res = await apiGet<ListingsPayload>(`/api/me/listings?${params}`, {
        token: accessToken,
      })
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    enabled: Boolean(accessToken),
  })

  const markSold = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiPut<{ listing: PublicListing }>(
        `/api/listings/${id}`,
        { status: "sold" },
        { token: accessToken }
      )
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    onSuccess: () => {
      toast.success("Listing marked as sold")
      void queryClient.invalidateQueries({ queryKey: ["my-listings"] })
      void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiDelete<{ deleted: boolean }>(`/api/listings/${id}`, {
        token: accessToken,
      })
      if (!res.success) throw new Error(res.error)
    },
    onSuccess: () => {
      toast.success("Listing removed permanently")
      void queryClient.invalidateQueries({ queryKey: ["my-listings"] })
      void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (isPending && !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Synchronizing Inventory...</p>
         </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="glass p-12 rounded-[2.5rem] border-rose-200 bg-rose-50/50 text-center">
        <p className="text-rose-600 font-bold mb-4">Failed to load inventory.</p>
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

  const { listings, pages, hasNext, hasPrev, total } = data

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Market <span className="text-gradient">Inventory</span></h1>
          <p className="mt-2 text-lg text-muted-foreground font-medium">
            {total === 0
              ? "You haven’t posted any assets yet."
              : `Managing ${total} marketplace listing${total === 1 ? "" : "s"}.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 glass px-4 py-1.5 rounded-full border-white/40 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Filter Status</span>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v ?? "all")
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[130px] h-8 border-none bg-transparent font-black text-xs focus:ring-0">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-white/40 glass">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link
            href="/listings/new"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all")}
          >
            <Plus className="mr-2 size-5" />
            Add New Asset
          </Link>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="glass p-20 text-center rounded-[3rem] border-dashed border-white/40 shadow-inner">
           <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="size-10 text-muted-foreground/30" />
           </div>
           <h3 className="text-2xl font-black mb-4">Inventory is empty</h3>
           <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-10 leading-relaxed">
             You don't have any listings matching this criteria. Create your first listing to start selling.
           </p>
           <Link 
             href="/listings/new" 
             className="inline-flex items-center gap-2 h-14 px-10 rounded-full bg-primary text-white font-black hover:scale-105 transition-all shadow-xl shadow-primary/20"
           >
             <Plus className="size-5" />
             Create First Listing
           </Link>
        </div>
      ) : (
        <div className="glass rounded-[3rem] border-white/40 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="border-b border-white/20 bg-primary/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Asset Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Valuation</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Market Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Engagement</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {listings.map((listing) => (
                  <tr key={listing._id} className="group hover:bg-white/40 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-[1.5rem] bg-muted border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                          <Image
                            src={listing.coverUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-black text-lg leading-tight group-hover:text-primary transition-colors">
                            {listing.title}
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                            {listing.category} · {listing.subcategory}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-xl font-black text-primary tracking-tight">{formatListingPrice(listing.price)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <Badge
                        className={cn("px-4 py-1.5 font-black uppercase tracking-widest text-[9px] border-2", statusBadgeClass(listing.status))}
                        variant="outline"
                      >
                        {listing.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <Eye className="size-4 text-muted-foreground" />
                          <span className="font-black text-sm">{listing.views}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/listings/${listing._id}`}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "h-12 w-12 rounded-full border border-white/40 bg-white shadow-sm hover:text-primary hover:bg-white transition-all"
                          )}
                          title="View Listing"
                        >
                          <ExternalLink className="size-5" />
                        </Link>
                        {listing.status === "active" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={markSold.isPending}
                            className="h-12 w-12 rounded-full border border-white/40 bg-white shadow-sm hover:text-emerald-500 hover:bg-white transition-all"
                            onClick={() => {
                              if (
                                typeof window !== "undefined" &&
                                !window.confirm(
                                  "Confirm mark as sold? This asset will remain visible but marked as Sold Out."
                                )
                              ) {
                                return
                              }
                              markSold.mutate(listing._id)
                            }}
                            title="Mark Sold"
                          >
                            <CheckCircle2 className="size-5" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={remove.isPending}
                          className="h-12 w-12 rounded-full border border-white/40 bg-white shadow-sm hover:text-rose-500 hover:bg-white transition-all"
                          onClick={() => {
                            if (
                              typeof window !== "undefined" &&
                              !window.confirm(
                                "Permanently delete this listing? This action is irreversible."
                              )
                            ) {
                              return
                            }
                            remove.mutate(listing._id)
                          }}
                          title="Delete Listing"
                        >
                          <Trash2 className="size-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                           <MoreVertical className="size-5 text-muted-foreground" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pages > 1 ? (
        <div className="flex items-center justify-center gap-6 pt-10">
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
             <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Inventory Page</span>
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

