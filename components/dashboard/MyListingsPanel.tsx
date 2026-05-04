"use client"

import Image from "next/image"
import Link from "next/link"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2, Trash2 } from "lucide-react"
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
      return "bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-100"
    case "pending":
      return "bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100"
    case "sold":
      return "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
    case "rejected":
      return "bg-destructive/15 text-destructive dark:bg-destructive/25"
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
        limit: "12",
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
      toast.success("Marked as sold")
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
      toast.success("Listing removed")
      void queryClient.invalidateQueries({ queryKey: ["my-listings"] })
      void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
    },
    onError: (e: Error) => toast.error(e.message),
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
        Failed to load your listings.{" "}
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

  const { listings, pages, hasNext, hasPrev, total } = data

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My listings</h1>
          <p className="mt-1 text-muted-foreground">
            {total === 0
              ? "You haven’t posted any ads yet."
              : `${total} listing${total === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status</span>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v ?? "all")
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link
            href="/listings/new"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Post an ad
          </Link>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No listings match this filter.{" "}
          <Link href="/listings/new" className="font-medium text-primary underline">
            Create one
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Listing</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Views</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {listings.map((listing) => (
                <tr key={listing._id} className="bg-card">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={listing.coverUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 font-medium leading-snug">
                          {listing.title}
                        </p>
                        <p className="text-xs capitalize text-muted-foreground">
                          {listing.category} · {listing.subcategory}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatListingPrice(listing.price)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={cn("capitalize", statusBadgeClass(listing.status))}
                    >
                      {listing.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">
                    {listing.views}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/listings/${listing._id}`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" })
                        )}
                      >
                        View
                      </Link>
                      {listing.status === "active" ? (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={markSold.isPending}
                          onClick={() => {
                            if (
                              typeof window !== "undefined" &&
                              !window.confirm(
                                "Mark this listing as sold? It will stay visible as sold."
                              )
                            ) {
                              return
                            }
                            markSold.mutate(listing._id)
                          }}
                        >
                          Mark sold
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        disabled={remove.isPending}
                        onClick={() => {
                          if (
                            typeof window !== "undefined" &&
                            !window.confirm(
                              "Delete this listing permanently? This cannot be undone."
                            )
                          ) {
                            return
                          }
                          remove.mutate(listing._id)
                        }}
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
