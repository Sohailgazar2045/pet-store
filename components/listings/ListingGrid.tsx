import type { PublicListing } from "@/lib/listings/public-listings"
import { ListingCard } from "@/components/listings/ListingCard"

type ListingGridProps = {
  listings: PublicListing[]
}

/**
 * World-class responsive grid for elite listing cards.
 */
export function ListingGrid({ listings }: ListingGridProps) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 lg:gap-x-10 lg:gap-y-16">
      {listings.map((listing, index) => (
        <li 
          key={listing._id}
          className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  )
}

