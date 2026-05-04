/**
 * Browse all listings — filters and grid will connect to GET /api/listings next.
 */
export default function ListingsPage() {
  return (
    <div className="container max-w-6xl flex-1 px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Browse listings</h1>
        <p className="mt-2 text-muted-foreground">
          Search and filter active cattle & pet listings. API wiring comes in the
          next build step.
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-background p-12 text-center text-sm text-muted-foreground">
        No listing grid yet — connect to the listings API to show results here.
      </div>
    </div>
  )
}
