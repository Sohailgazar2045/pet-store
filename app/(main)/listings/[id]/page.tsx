import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { getPublicListingById } from "@/lib/listings/get-public-by-id"
import { cn, formatListingPrice } from "@/lib/utils"
import { MapPin } from "lucide-react"

export const revalidate = 300

type PageProps = {
  params: { id: string }
}

/**
 * Single listing detail — increments view count once per load.
 */
export default async function ListingDetailPage({ params }: PageProps) {
  const listing = await getPublicListingById(params.id)
  if (!listing) {
    notFound()
  }

  const isCattle = listing.category === "cattle"

  return (
    <div className="container max-w-6xl flex-1 px-4 py-10">
      <div className="mb-6">
        <Link
          href="/listings"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground"
          )}
        >
          ← All listings
        </Link>
      </div>

      {listing.status === "pending" ? (
        <div
          className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
          role="status"
        >
          This listing is <strong>pending review</strong>. It will appear in browse/search
          after an admin approves it.
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src={listing.coverUrl}
              alt={listing.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              className={cn(
                "capitalize",
                isCattle ? "bg-green-600 hover:bg-green-600" : "bg-sky-600 hover:bg-sky-600"
              )}
            >
              {listing.category}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {listing.subcategory}
            </Badge>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{listing.title}</h1>
            <p className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {listing.location.city}, {listing.location.state},{" "}
              {listing.location.country}
            </p>
          </div>
          <section>
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {listing.description}
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-primary">
              {formatListingPrice(listing.price)}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Seller</p>
            <p className="font-medium">{listing.seller.name}</p>
            <Button className="mt-6 w-full" type="button" disabled>
              Chat with seller (coming soon)
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
