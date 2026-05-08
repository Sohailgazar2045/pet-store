import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPublicListingById } from "@/lib/listings/get-public-by-id"
import { cn, formatListingPrice } from "@/lib/utils"
import { 
  MapPin, 
  ShieldCheck, 
  Share2, 
  ChevronRight,
  Phone,
  MessageCircle,
  Flag,
  Clock,
  CheckCircle,
  Star,
  Info
} from "lucide-react"
import { ListingActions } from "@/components/listings/ListingActions"
import { FavoriteButton } from "@/components/listings/FavoriteButton"
import { queryPublicListings } from "@/lib/listings/public-listings"
import { ListingCard } from "@/components/listings/ListingCard"

export const revalidate = 300

type PageProps = {
  params: { id: string }
}

import type { Metadata } from "next"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const listing = await getPublicListingById(params.id)
  if (!listing) return { title: "Listing Not Found" }
  
  return {
    title: `${listing.title} | PasturePro`,
    description: `${listing.title} for ${formatListingPrice(listing.price)} in ${listing.location.city}.`,
  }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const listing = await getPublicListingById(params.id)
  if (!listing) {
    notFound()
  }

  const { listings: similarListings } = await queryPublicListings({
    category: listing.category,
    limit: 4,
    status: "active"
  })

  return (
    <div className="bg-[#f2f4f5] dark:bg-[#050505] min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="container py-4">
         <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="size-3" />
            <Link href="/listings" className="hover:text-primary">Marketplace</Link>
            <ChevronRight className="size-3" />
            <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{listing.title}</span>
         </nav>
      </div>

      <div className="container max-w-7xl">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Image & Description */}
            <div className="lg:col-span-8 space-y-6">
               {/* Image Gallery Container */}
               <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="relative aspect-[16/10] bg-black">
                     <Image
                        src={listing.coverUrl}
                        alt={listing.title}
                        fill
                        priority
                        className="object-contain"
                     />
                  </div>
                  {listing.images.length > 1 && (
                     <div className="p-4 flex gap-3 overflow-x-auto">
                        {listing.images.map((img, i) => (
                           <div key={i} className="relative h-20 w-24 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer shrink-0 transition-all">
                              <Image src={img.url} alt={`View ${i}`} fill className="object-cover" />
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {/* Description & Details Section */}
               <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
                  <div>
                     <h2 className="text-2xl font-black mb-6 border-b pb-4 border-slate-100 dark:border-slate-800">Description</h2>
                     <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap font-medium">
                        {listing.description}
                     </div>
                  </div>

                  <div>
                     <h2 className="text-2xl font-black mb-6 border-b pb-4 border-slate-100 dark:border-slate-800">Attributes</h2>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6">
                        {[
                           { label: "Category", value: listing.category },
                           { label: "Subcategory", value: listing.subcategory },
                           { label: "Breed", value: listing.breed || "Standard" },
                           { label: "Posted", value: "2 days ago" },
                           { label: "Condition", value: "Verified Healthy" }
                        ].map((attr) => (
                           <div key={attr.label}>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{attr.label}</p>
                              <p className="font-bold text-slate-900 dark:text-white">{attr.value}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* RIGHT COLUMN: Price & Seller */}
            <aside className="lg:col-span-4 space-y-6 sticky top-8">
               {/* Price Module */}
               <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                     <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {formatListingPrice(listing.price)}
                     </h1>
                     <div className="flex gap-2">
                        <FavoriteButton listingId={listing._id} className="h-10 w-10 border-slate-100" />
                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-slate-100">
                           <Share2 className="size-4" />
                        </Button>
                     </div>
                  </div>
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-8 line-clamp-2">
                     {listing.title}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-6 border-t border-slate-50 dark:border-slate-800">
                     <div className="flex items-center gap-2">
                        <MapPin className="size-3.5" />
                        {listing.location.city}
                     </div>
                     <div className="flex items-center gap-2">
                        <Clock className="size-3.5" />
                        2 days ago
                     </div>
                  </div>
               </div>

               {/* Seller Module */}
               <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Seller Description</h3>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-primary">
                        {listing.seller.name[0]}
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <h4 className="text-xl font-black">{listing.seller.name}</h4>
                           <CheckCircle className="size-4 text-emerald-500" />
                        </div>
                        <p className="text-xs font-bold text-slate-400">Member since May 2024</p>
                     </div>
                     <ChevronRight className="size-6 text-slate-300" />
                  </div>
                  
                  <div className="space-y-4">
                     <ListingActions listingId={listing._id} sellerId={listing.seller._id} />
                     <Button variant="outline" className="w-full h-14 rounded-lg font-black text-lg border-2 border-slate-900 dark:border-slate-100 dark:text-white flex items-center gap-3">
                        <Phone className="size-5" /> Show Phone Number
                     </Button>
                  </div>
               </div>

               {/* Location Preview (Placeholder for Map) */}
               <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Posted in</h3>
                  <p className="font-bold mb-4">{listing.location.city}, Pakistan</p>
                  <div className="aspect-[16/9] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 overflow-hidden relative">
                     <MapPin className="size-12 opacity-20" />
                     <div className="absolute inset-0 bg-primary/5" />
                  </div>
               </div>

               <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors py-4">
                  <Flag className="size-3" /> Report this listing
               </button>
            </aside>
         </div>

         {/* Similar Listings */}
         {similarListings.length > 0 && (
            <div className="mt-20">
               <h2 className="text-2xl font-black mb-8">Related Listings</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {similarListings.filter(l => l._id !== listing._id).slice(0, 4).map(similar => (
                     <ListingCard key={similar._id} listing={similar} />
                  ))}
               </div>
            </div>
         )}
      </div>
    </div>
  )
}



