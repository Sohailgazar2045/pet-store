import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { getPublicListingById } from "@/lib/listings/get-public-by-id"
import { cn, formatListingPrice } from "@/lib/utils"
import { MapPin, ShieldCheck, Share2, Heart, MessageCircle, Info } from "lucide-react"
import { ListingActions } from "@/components/listings/ListingActions"
import { FavoriteButton } from "@/components/listings/FavoriteButton"

export const revalidate = 300

type PageProps = {
  params: { id: string }
}

import type { Metadata } from "next"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const listing = await getPublicListingById(params.id)
  if (!listing) return { title: "Listing Not Found" }
  
  return {
    title: `${listing.title} | ${listing.category}`,
    description: `Buy ${listing.title} for ${formatListingPrice(listing.price)} in ${listing.location.city}, ${listing.location.state}. Professional trading on PasturePro.`,
    openGraph: {
      images: [listing.coverUrl]
    }
  }
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
  const isVerified = listing.views > 100 // Mock verification

  return (
    <div className="bg-muted/30 min-h-screen py-12">
      <div className="container max-w-7xl">
        {/* Breadcrumbs / Back */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/listings"
            className="group flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-all"
          >
            <div className="h-10 w-10 rounded-full border bg-white flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
               ←
            </div>
            Back to Marketplace
          </Link>
          <div className="flex gap-3">
             <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white shadow-sm hover:text-primary">
                <Share2 className="size-4" />
             </Button>
             <FavoriteButton listingId={listing._id} className="h-10 w-10 bg-white shadow-sm" />
          </div>
        </div>

        {listing.status === "pending" && (
          <div className="mb-8 glass p-6 border-amber-200 bg-amber-50/50 text-amber-900 flex items-center gap-4 rounded-[2rem] shadow-xl animate-pulse">
            <div className="h-12 w-12 rounded-full bg-amber-500 flex-shrink-0 flex items-center justify-center text-white font-black text-xl">!</div>
            <div>
               <p className="text-sm font-black uppercase tracking-widest mb-1">Under Review</p>
               <p className="text-sm font-medium opacity-80">
                 This listing is currently being verified by our team. It will be live soon.
               </p>
            </div>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Images & Description */}
          <div className="lg:col-span-8 space-y-10">
            {/* Image Section */}
            <div className="space-y-6">
               <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[3rem] shadow-2xl bg-white border-8 border-white group">
                <Image
                  src={listing.coverUrl}
                  alt={listing.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute top-6 right-6">
                   {isVerified && (
                     <Badge className="bg-blue-500 text-white border-0 shadow-2xl px-4 py-2 font-black tracking-widest flex items-center gap-2">
                        <ShieldCheck className="size-4" />
                        VERIFIED LISTING
                     </Badge>
                   )}
                </div>
              </div>
              {listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-6">
                   {listing.images.slice(0, 4).map((img, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden shadow-xl border-4 border-white cursor-pointer hover:scale-105 transition-all group">
                         <Image src={img.url} alt={`Photo ${i}`} fill className="object-cover transition-transform group-hover:scale-110" />
                         {i === 3 && listing.images.length > 4 && (
                           <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-black text-xl">
                              +{listing.images.length - 4}
                           </div>
                         )}
                      </div>
                   ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="glass p-10 rounded-[3rem] shadow-xl space-y-12 border-white/60">
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between border-b border-white/20 pb-10">
                <div className="flex-1">
                   <div className="flex flex-wrap gap-2 mb-6">
                      <Badge className={cn("px-4 py-1.5 font-black uppercase tracking-[0.2em] text-[10px]", isCattle ? "bg-emerald-500 text-white" : "bg-amber-500 text-white")}>
                        {listing.category}
                      </Badge>
                      <Badge variant="secondary" className="px-4 py-1.5 font-black uppercase tracking-[0.2em] text-[10px] bg-muted/50 text-muted-foreground border-white/40">
                        {listing.subcategory}
                      </Badge>
                   </div>
                   <h1 className="text-5xl font-black mb-4 tracking-tight leading-[1.1]">{listing.title}</h1>
                   <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                      <div className="flex items-center gap-2">
                         <MapPin className="size-5 text-primary" />
                         <span className="font-bold text-foreground">{listing.location.city}, {listing.location.state}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Info className="size-5 text-primary" />
                         <span className="text-xs font-black uppercase tracking-widest">{listing.views} Market Views</span>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-4xl font-black text-primary bg-primary/5 px-10 py-6 rounded-[2rem] border border-primary/10 shadow-inner">
                      {formatListingPrice(listing.price)}
                   </div>
                   <p className="mt-2 text-xs font-black text-muted-foreground uppercase tracking-widest">Negotiable Price</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <span className="h-8 w-2 rounded-full bg-primary shadow-lg shadow-primary/20"></span>
                  Professional Specifications
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                  {[
                    { label: "Breed Type", value: listing.breed ?? "Not specified" },
                    { label: "Market Category", value: listing.category },
                    { label: "Classification", value: listing.subcategory },
                    { label: "Listing Date", value: new Date(listing.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) },
                    { label: "Current Location", value: listing.location.city },
                    { label: "Health Status", value: "Verified Healthy" }
                  ].map((spec) => (
                    <div key={spec.label} className="space-y-2 p-4 rounded-2xl bg-white/40 border border-white/20">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{spec.label}</p>
                       <p className="font-black text-foreground text-lg">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <span className="h-8 w-2 rounded-full bg-primary shadow-lg shadow-primary/20"></span>
                  Detailed Description
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap bg-white/40 p-8 rounded-[2rem] border border-white/20">
                  {listing.description}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Seller & Action */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24">
            <div className="glass p-10 rounded-[3rem] shadow-2xl border-white/60 bg-white/80">
              <div className="text-center mb-10 pb-10 border-b border-white/20">
                 <div className="h-28 w-28 rounded-[2.5rem] bg-primary/10 mx-auto flex items-center justify-center text-5xl font-black text-primary border-4 border-white mb-6 shadow-2xl rotate-3">
                    {listing.seller.name[0]}
                 </div>
                 <h3 className="text-3xl font-black tracking-tight">{listing.seller.name}</h3>
                 <div className="mt-3 flex items-center justify-center gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 font-black text-[10px] tracking-widest">VERIFIED SELLER</Badge>
                 </div>
                 <div className="mt-6 flex items-center justify-center gap-1.5 text-amber-500">
                    {[1,2,3,4,5].map(s => <span key={s} className="text-xl">★</span>)}
                    <span className="text-xs font-black text-muted-foreground ml-3 uppercase tracking-widest">(12 reviews)</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <ListingActions listingId={listing._id} sellerId={listing.seller._id} />
                 
                 <Button variant="outline" className="w-full h-14 rounded-full font-black flex items-center justify-center gap-2 border-2 hover:bg-muted transition-all">
                    <Share2 className="size-4" />
                    Share Listing
                 </Button>
              </div>

              <div className="mt-10 pt-8 border-t border-white/20 space-y-4">
                 <div className="flex items-center justify-between text-sm font-black">
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Member Since</span>
                    <span>Jan 2024</span>
                 </div>
                 <div className="flex items-center justify-between text-sm font-black">
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Response Rate</span>
                    <span className="text-emerald-500">98%</span>
                 </div>
                 <div className="flex items-center justify-between text-sm font-black">
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Average Response</span>
                    <span>&lt; 2 Hours</span>
                 </div>
              </div>
            </div>

            <div className="glass p-8 rounded-[2.5rem] shadow-xl border-white/40 bg-primary text-white overflow-hidden relative group">
               <h4 className="text-xl font-black mb-6 relative z-10 flex items-center gap-2">
                  <ShieldCheck className="size-6" />
                  PasturePro Protection
               </h4>
               <ul className="space-y-6 text-sm font-bold relative z-10">
                  <li className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs">1</div>
                    <p className="opacity-90">Always use our secure in-platform chat for a verified record of trade.</p>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs">2</div>
                    <p className="opacity-90">Book an on-site professional inspection through our partner network.</p>
                  </li>
                  <li className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs">3</div>
                    <p className="opacity-90">Never make full payments before physically inspecting the asset.</p>
                  </li>
               </ul>
               <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
