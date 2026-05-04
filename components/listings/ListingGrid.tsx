import type { PublicListing } from "@/lib/listings/public-listings"
import { ListingCard } from "@/components/listings/ListingCard"

type ListingGridProps = {
  listings: PublicListing[]
}

/**
 * Responsive grid for listing cards.
 */
export function ListingGrid({ listings }: ListingGridProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <li key={listing._id}>
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  )
}
