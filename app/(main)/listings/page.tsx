import Link from "next/link"
import { ListingGrid } from "@/components/listings/ListingGrid"
import { ListingFilters } from "@/components/listings/ListingFilters"
import { buttonVariants } from "@/components/ui/button"
import { queryPublicListings } from "@/lib/listings/public-listings"
import { listingsQuerySchema } from "@/lib/validations/listing.query"
import { cn } from "@/lib/utils"
import { Suspense } from "react"
import { SlidersHorizontal, Plus, ShoppingBag, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Premium Marketplace Catalog | PasturePro",
  description: "Explore our global inventory of verified livestock and pets. Filter by category, price, and location to find exactly what you're looking for.",
}

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

export default async function ListingsPage({ searchParams }: PageProps) {
  const parsed = listingsQuerySchema.safeParse(flattenSearchParams(searchParams))

  if (!parsed.success) {
    return (
      <div className="container max-w-7xl px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass p-12 rounded-[3.5rem] border-rose-200 bg-rose-50/50 text-center max-w-lg">
          <h2 className="text-3xl font-black text-rose-900 mb-4">Invalid Catalog View</h2>
          <p className="text-rose-600/80 font-medium mb-10 leading-relaxed">
            We couldn&apos;t generate the requested catalog view. Please reset the marketplace parameters.
          </p>
          <Link href="/listings" className={cn(buttonVariants({ variant: "outline" }), "rounded-full border-rose-200 text-rose-600 hover:bg-rose-100 font-black px-12 h-14")}>Reset Marketplace</Link>
        </div>
      </div>
    )
  }

  const result = await queryPublicListings(parsed.data)

  return (
    <div className="bg-[#fcfcfc] dark:bg-[#050505] min-h-screen">
      {/* Commerce Header */}
      <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800">
         <div className="container max-w-7xl px-4 py-16">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
               <div>
                  <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                     <Link href="/" className="hover:text-primary">Home</Link>
                     <span>/</span>
                     <span className="text-slate-900 dark:text-white">Marketplace Catalog</span>
                  </nav>
                  <h1 className="text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white flex items-center gap-4">
                     Store <span className="text-gradient">Catalog</span>
                     <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl">
                        <ShoppingBag className="size-5" />
                     </div>
                  </h1>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                    Discover {result.total} verified assets across our global professional network.
                  </p>
               </div>
               
               <div className="flex items-center gap-4">
                  <Link 
                    href="/listings/new" 
                    className="h-16 px-10 rounded-full bg-slate-900 text-white dark:bg-primary font-black text-lg flex items-center gap-3 shadow-2xl hover:scale-105 transition-all"
                  >
                    <Plus className="size-6" /> Sell Asset
                  </Link>
               </div>
            </div>
         </div>
      </div>

      <div className="container max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Commerce Sidebar */}
          <aside className="lg:col-span-3 sticky top-32">
             <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                   <SlidersHorizontal className="size-5 text-primary" />
                   <h3 className="text-lg font-black tracking-tight">Shopping Filters</h3>
                </div>
                <Link href="/listings" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Reset</Link>
             </div>
             <Suspense fallback={<div className="space-y-8 animate-pulse">
                <div className="h-6 w-1/2 bg-slate-200 rounded-lg" />
                <div className="h-12 w-full bg-slate-100 rounded-2xl" />
                <div className="h-40 w-full bg-slate-100 rounded-3xl" />
             </div>}>
                <ListingFilters />
             </Suspense>
          </aside>

          {/* Catalog Grid */}
          <main className="lg:col-span-9">
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-100 dark:border-slate-900">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                     <LayoutGrid className="size-5" />
                  </div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                     Showing {result.listings.length} Results
                  </p>
               </div>
               {/* Sort Select Placeholder */}
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Sort: <span className="text-slate-900 dark:text-white cursor-pointer ml-1">Newest Arrivals</span>
               </div>
            </div>

            {result.listings.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-24 text-center shadow-sm">
                <div className="h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-4xl mx-auto mb-8">📭</div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Catalog is Empty</h3>
                <p className="text-lg text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
                  No products match your current filters. Try removing some selections to see more results.
                </p>
                <Link href="/listings" className={cn(buttonVariants({ variant: "outline" }), "rounded-full font-black h-14 px-12 text-lg border-2")}>
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="space-y-20">
                <ListingGrid listings={result.listings} />
                
                {result.pages > 1 && (
                  <div className="flex items-center justify-center gap-8 pt-20">
                     <div className="flex items-center gap-2">
                        {result.hasPrev ? (
                          <Link
                            href={`/listings?${new URLSearchParams({ ...flattenSearchParams(searchParams), page: String(result.page - 1) }).toString()}`}
                            className="h-14 w-14 rounded-full border-2 border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                          >
                            <ChevronLeft className="size-6" />
                          </Link>
                        ) : (
                          <div className="h-14 w-14 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300">
                            <ChevronLeft className="size-6" />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-slate-100 dark:bg-slate-800 font-black text-sm">
                           <span className="text-primary">{result.page}</span>
                           <span className="text-slate-400">/</span>
                           <span>{result.pages}</span>
                        </div>

                        {result.hasNext ? (
                          <Link
                            href={`/listings?${new URLSearchParams({ ...flattenSearchParams(searchParams), page: String(result.page + 1) }).toString()}`}
                            className="h-14 w-14 rounded-full border-2 border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                          >
                            <ChevronRight className="size-6" />
                          </Link>
                        ) : (
                          <div className="h-14 w-14 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300">
                            <ChevronRight className="size-6" />
                          </div>
                        )}
                     </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}



