import { ListingGridSkeleton } from "@/components/listings/ListingSkeleton"

export default function ListingsLoading() {
  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container max-w-7xl px-4 py-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between animate-pulse">
          <div>
            <div className="h-10 w-48 bg-muted rounded-2xl mb-4" />
            <div className="h-6 w-96 bg-muted rounded-xl" />
          </div>
          <div className="h-12 w-48 bg-muted rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-3">
             <div className="h-[500px] w-full bg-muted/50 rounded-[2.5rem] animate-pulse border border-white/20" />
          </aside>
          <main className="lg:col-span-9">
            <ListingGridSkeleton count={9} />
          </main>
        </div>
      </div>
    </div>
  )
}
