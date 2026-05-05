import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { PublicListing } from "@/lib/listings/public-listings"
import { cn, formatListingPrice } from "@/lib/utils"
import { MapPin, ShieldCheck, Heart } from "lucide-react"
import { FavoriteButton } from "@/components/listings/FavoriteButton"

type ListingCardProps = {
  listing: PublicListing
}

/**
 * Compact listing preview for grids (browse, homepage).
 */
export function ListingCard({ listing }: ListingCardProps) {
  const isCattle = listing.category === "cattle"
  const isVerified = listing.views > 100 // Mocking verification for demo

  return (
    <div className="relative group">
      <Link
        href={`/listings/${listing._id}`}
        className="block overflow-hidden rounded-[2rem] border bg-card text-card-foreground shadow-sm transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] hover:-translate-y-2 border-white/40"
      >
        <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
          <Image
            src={listing.coverUrl}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            <Badge
              className={cn(
                "border-0 capitalize shadow-lg px-3 py-1 font-black tracking-widest text-[10px]",
                isCattle
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-amber-500 text-white hover:bg-amber-600"
              )}
            >
              {listing.category}
            </Badge>
            {isVerified && (
              <Badge className="bg-blue-500 text-white border-0 shadow-lg px-3 py-1 font-black tracking-widest text-[10px] flex items-center gap-1">
                <ShieldCheck className="size-3" />
                VERIFIED
              </Badge>
            )}
          </div>

          {listing.status === "sold" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
              <span className="rounded-full bg-white px-6 py-2 text-xs font-black uppercase tracking-widest text-black shadow-2xl">
                Sold Out
              </span>
            </div>
          ) : null}
        </div>
        
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-2xl font-black text-primary tracking-tight">
              {formatListingPrice(listing.price)}
            </p>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-white/20">
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
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/10">
               <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">
                    {listing.seller.name[0]}
                  </div>
                  <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{listing.seller.name}</span>
               </div>
               <span className="text-[10px] font-bold text-muted-foreground/60">{new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <FavoriteButton 
        listingId={listing._id} 
        className="absolute top-3 right-3 z-10 shadow-2xl"
      />
    </div>
  )
}

