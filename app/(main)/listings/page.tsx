import Link from "next/link"
import { ListingGrid } from "@/components/listings/ListingGrid"
import { buttonVariants } from "@/components/ui/button"
import { queryPublicListings } from "@/lib/listings/public-listings"
import { listingsQuerySchema } from "@/lib/validations/listing.query"
import { cn } from "@/lib/utils"

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
 * Browse listings — data from Mongo via `queryPublicListings` (same logic as GET /api/listings).
 */
export default async function ListingsPage({ searchParams }: PageProps) {
  const parsed = listingsQuerySchema.safeParse(flattenSearchParams(searchParams))

  if (!parsed.success) {
    return (
      <div className="container max-w-6xl flex-1 px-4 py-10">
        <p className="text-destructive">
          Invalid filters: {parsed.error.issues[0]?.message}
        </p>
      </div>
    )
  }

  const result = await queryPublicListings(parsed.data)

  return (
    <div className="container max-w-6xl flex-1 px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse listings</h1>
          <p className="mt-2 text-muted-foreground">
            {result.total === 0
              ? "No listings match your filters yet."
              : `Showing ${result.listings.length} of ${result.total} active listings`}
          </p>
        </div>
        <Link href="/listings/new" className={cn(buttonVariants())}>
          Post an ad
        </Link>
      </div>

      {result.listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-background p-12 text-center text-sm text-muted-foreground">
          Nothing here yet — run{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            npm run db:seed
          </code>{" "}
          to insert demo listings (requires MongoDB).
        </div>
      ) : (
        <>
          <ListingGrid listings={result.listings} />
          {result.pages > 1 ? (
            <nav
              className="mt-10 flex justify-center gap-2 text-sm text-muted-foreground"
              aria-label="Pagination"
            >
              <span>
                Page {result.page} of {result.pages}
              </span>
            </nav>
          ) : null}
        </>
      )}
    </div>
  )
}
