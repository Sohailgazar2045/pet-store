import Link from "next/link"
import { ListingGrid } from "@/components/listings/ListingGrid"
import { ListingFilters } from "@/components/listings/ListingFilters"
import { Button, buttonVariants } from "@/components/ui/button"
import { queryPublicListings } from "@/lib/listings/public-listings"
import { listingsQuerySchema } from "@/lib/validations/listing.query"
import { cn } from "@/lib/utils"
import { Suspense } from "react"

export const revalidate = 60

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

function flattenSearchParams(
  sp: Record<string, string | string[] | undefined>
): Record<string, string> {
  const raw: Record<string, string> = {}
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue
    raw[key] = Array.isArray(value) ? value[0] ?? "" : value
  }
  return raw
}

/**
 * Browse listings — data from Mongo via `queryPublicListings`.
 */
export default async function ListingsPage({ searchParams }: PageProps) {
  const parsed = listingsQuerySchema.safeParse(flattenSearchParams(searchParams))

  if (!parsed.success) {
    return (
      <div className="container max-w-7xl flex-1 px-4 py-10">
        <div className="glass p-8 rounded-3xl border-rose-200 bg-rose-50/50">
          <p className="text-rose-600 font-bold">
            Invalid filters: {parsed.error.issues[0]?.message}
          </p>
          <Link href="/listings" className="text-sm font-black text-rose-500 mt-2 block hover:underline">Reset all filters</Link>
        </div>
      </div>
    )
  }

  const result = await queryPublicListings(parsed.data)

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container max-w-7xl px-4 py-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Marketplace</h1>
            <p className="text-lg text-muted-foreground font-medium">
              {result.total === 0
                ? "No listings match your search criteria."
                : `Discover ${result.total} verified listings from trusted sellers.`}
            </p>
          </div>
          <Link 
            href="/listings/new" 
            className={cn(buttonVariants(), "h-12 px-8 rounded-full shadow-lg shadow-primary/20 font-black")}
          >
            + Post a New Listing
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3">
             <Suspense fallback={<div className="h-[400px] w-full bg-muted animate-pulse rounded-[2rem]" />}>
                <ListingFilters />
             </Suspense>
          </aside>

          {/* Listings Grid */}
          <main className="lg:col-span-9 space-y-8">
            {result.listings.length === 0 ? (
              <div className="glass rounded-[3rem] border-dashed border-white/40 p-20 text-center shadow-xl">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-6">🔍</div>
                <h3 className="text-2xl font-black mb-2">No listings found</h3>
                <p className="text-muted-foreground font-medium max-w-md mx-auto mb-8">
                  We couldn't find anything matching your filters. Try adjusting your search or category.
                </p>
                <Link href="/listings" className={cn(buttonVariants({ variant: "outline" }), "rounded-full font-black")}>
                  Clear all filters
                </Link>
              </div>
            ) : (
              <>
                <ListingGrid listings={result.listings} />
                
                {result.pages > 1 && (
                  <div className="flex items-center justify-between pt-8 border-t border-white/20">
                     <p className="text-sm font-bold text-muted-foreground">
                        Page {result.page} of {result.pages}
                     </p>
                     <div className="flex gap-2">
                        {/* Simple Pagination - in a real app these would be Links with page param */}
                        <Button variant="outline" disabled={!result.hasPrev} className="rounded-xl font-black">Previous</Button>
                        <Button variant="outline" disabled={!result.hasNext} className="rounded-xl font-black">Next</Button>
                     </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

