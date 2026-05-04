import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { PublicListing } from "@/lib/listings/public-listings"
import { cn, formatListingPrice } from "@/lib/utils"
import { MapPin } from "lucide-react"

type ListingCardProps = {
  listing: PublicListing
}

/**
 * Compact listing preview for grids (browse, homepage).
 */
export function ListingCard({ listing }: ListingCardProps) {
  const isCattle = listing.category === "cattle"

  return (
    <Link
      href={`/listings/${listing._id}`}
      className="group block overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video w-full bg-muted">
        <Image
          src={listing.coverUrl}
          alt={listing.title}
          fill
          className="object-cover transition-transform group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Badge
          className={cn(
            "absolute left-2 top-2 border-0 capitalize shadow-sm",
            isCattle
              ? "bg-green-600 text-white hover:bg-green-600"
              : "bg-sky-600 text-white hover:bg-sky-600"
          )}
        >
          {listing.category}
        </Badge>
        {listing.status === "sold" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-md bg-background px-3 py-1 text-sm font-semibold uppercase tracking-wide">
              Sold
            </span>
          </div>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <p className="text-lg font-bold tabular-nums text-primary">
          {formatListingPrice(listing.price)}
        </p>
        <h2 className="line-clamp-2 font-semibold leading-snug tracking-tight">
          {listing.title}
        </h2>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            {listing.location.city}, {listing.location.state}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          {listing.breed ? `${listing.breed} · ` : null}
          {listing.subcategory}
        </p>
      </div>
    </Link>
  )
}
