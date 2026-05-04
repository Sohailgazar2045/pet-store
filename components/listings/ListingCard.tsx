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
      className="group block overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] w-full bg-muted">
        <Image
          src={listing.coverUrl}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Badge
          className={cn(
            "absolute left-3 top-3 border-0 capitalize shadow-lg px-3 py-1",
            isCattle
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-amber-500 text-white hover:bg-amber-600"
          )}
        >
          {listing.category}
        </Badge>
        {listing.status === "sold" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black shadow-xl">
              Sold
            </span>
          </div>
        ) : null}
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-2xl font-black text-primary">
            {formatListingPrice(listing.price)}
          </p>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
             {listing.subcategory}
          </div>
        </div>
        <h2 className="mb-4 line-clamp-1 text-lg font-black tracking-tight group-hover:text-primary transition-colors">
          {listing.title}
        </h2>
        <div className="flex flex-col gap-3">
           <p className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="truncate">
              {listing.location.city}, {listing.location.state}
            </span>
          </p>
          {listing.breed && (
             <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary/40"></div>
                <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em]">{listing.breed}</span>
             </div>
          )}
        </div>
      </div>
    </Link>
  )
}
