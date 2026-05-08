"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { PublicListing } from "@/lib/listings/public-listings"
import { cn, formatListingPrice } from "@/lib/utils"
import { MapPin, Heart, Clock } from "lucide-react"
import { FavoriteButton } from "@/components/listings/FavoriteButton"

type ListingCardProps = {
  listing: PublicListing
}

export function ListingCard({ listing }: ListingCardProps) {
  const timeAgo = "2 days ago" // Placeholder for actual logic

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/listings/${listing._id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={listing.coverUrl}
            alt={listing.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {listing.status === "sold" && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge className="bg-white text-black border-none font-black px-4 py-1.5">SOLD</Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
             <span className="text-xl font-black text-slate-900 dark:text-white">
               {formatListingPrice(listing.price)}
             </span>
             <FavoriteButton 
               listingId={listing._id} 
               className="h-8 w-8 bg-transparent border-none hover:bg-slate-100 shadow-none" 
             />
          </div>
          
          <h3 className="text-slate-700 dark:text-slate-300 font-medium line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          
          <div className="mt-4 flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1">
                   <MapPin className="size-3" />
                   <span>{listing.location.city}</span>
                </div>
                <div className="flex items-center gap-1">
                   <Clock className="size-3" />
                   <span>{timeAgo}</span>
                </div>
             </div>
          </div>
        </div>
      </Link>
    </div>
  )
}





