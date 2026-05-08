"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { PublicListing } from "@/lib/listings/public-listings"
import { cn, formatListingPrice } from "@/lib/utils"
import { MapPin, ShieldCheck, Eye, ShoppingCart, Star, Zap, Award, Sparkles } from "lucide-react"
import { FavoriteButton } from "@/components/listings/FavoriteButton"

type ListingCardProps = {
  listing: PublicListing
}

export function ListingCard({ listing }: ListingCardProps) {
  const isCattle = listing.category === "cattle"
  const isTrending = listing.views > 200
  const isNew = new Date(listing.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000

  return (
    <div className="group relative h-full">
      <div
        className="flex flex-col h-full overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_40px_80px_-16px_rgba(0,0,0,0.12)] hover:-translate-y-2"
      >
        {/* Product Visual Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
          <Link href={`/listings/${listing._id}`} className="block h-full w-full">
            <Image
              src={listing.coverUrl}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-[2s] group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
          
          {/* Elite Status Chips */}
          <div className="absolute left-4 top-4 flex flex-col gap-2 z-10 pointer-events-none">
            {isNew && (
              <Badge className="bg-primary text-white border-none px-4 py-1.5 font-black text-[9px] tracking-widest shadow-xl rounded-full flex items-center gap-2">
                <Sparkles className="size-3" /> NEW
              </Badge>
            )}
            {isTrending && (
              <Badge className="bg-orange-500 text-white border-none px-4 py-1.5 font-black text-[9px] tracking-widest shadow-xl rounded-full flex items-center gap-2">
                <Zap className="size-3 fill-current" /> TRENDING
              </Badge>
            )}
          </div>

          <div className="absolute right-4 top-4 z-20">
             <FavoriteButton 
               listingId={listing._id} 
               className="bg-white/90 backdrop-blur-xl hover:bg-white border-none shadow-2xl scale-110"
             />
          </div>

          {/* Commerce Action Strip */}
          <div className="absolute inset-x-4 bottom-4 translate-y-[calc(100%+16px)] group-hover:translate-y-0 transition-transform duration-500 z-20">
             <Link 
                href={`/listings/${listing._id}`}
                className="w-full h-14 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:bg-primary hover:text-white transition-all border border-white/20"
             >
                <Eye className="size-4" /> Quick Inspect
             </Link>
          </div>
        </div>
        
        {/* Product Intelligence Section */}
        <div className="flex-1 p-8 flex flex-col">
          <div className="flex-1 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="size-3 text-primary" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {listing.category} Catalog
                   </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600">
                   <Star className="size-3 fill-current" />
                   <span className="text-[10px] font-black">4.9</span>
                </div>
             </div>
             
             <Link href={`/listings/${listing._id}`}>
                <h3 className="line-clamp-2 text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-[1.2] min-h-[3rem]">
                   {listing.title}
                </h3>
             </Link>

             <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
               <MapPin className="size-3.5 shrink-0 text-primary" />
               <span className="truncate">{listing.location.city} · Registered Dealer</span>
             </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Market Valuation</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                   {formatListingPrice(listing.price)}
                </span>
             </div>
             
             <Link 
                href={`/listings/${listing._id}`}
                className="h-14 w-14 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group/btn"
             >
                <ShoppingCart className="size-6 group-hover/btn:scale-110 transition-transform" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  )
}




