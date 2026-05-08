import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { getPublicListingById } from "@/get-public-by-id"
import { cn, formatListingPrice } from "@/lib/utils"
import { 
  MapPin, 
  ShieldCheck, 
  Share2, 
  Heart, 
  MessageCircle, 
  Info, 
  ArrowLeft, 
  CheckCircle, 
  Calendar, 
  Eye, 
  Flag, 
  AlertCircle, 
  Scale, 
  History, 
  Stethoscope, 
  Verified,
  Award,
  ChevronRight,
  Phone
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
    description: `Professional trade: ${listing.title} for ${formatListingPrice(listing.price)} in ${listing.location.city}.`,
  }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const listing = await getPublicListingById(params.id)
  if (!listing) {
    notFound()
  }

  // Fetch similar listings for upsell
  const { listings: similarListings } = await queryPublicListings({
    category: listing.category,
    limit: 4,
    status: "active"
  })

  const isCattle = listing.category === "cattle"

  return (
    <div className="bg-[#fcfcfc] dark:bg-[#050505] min-h-screen pb-32">
      {/* Commerce Breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 py-6">
         <div className="container max-w-7xl">
            <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <Link href="/" className="hover:text-primary transition-colors">Home</Link>
               <ChevronRight className="size-3" />
               <Link href="/listings" className="hover:text-primary transition-colors">Marketplace</Link>
               <ChevronRight className="size-3" />
               <Link href={`/listings?category=${listing.category}`} className="hover:text-primary transition-colors">{listing.category}</Link>
               <ChevronRight className="size-3" />
               <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{listing.title}</span>
            </nav>
         </div>
      </div>

      <div className="container max-w-7xl mt-12 lg:mt-20">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* LEFT: Visual Assets & Core Details */}
            <div className="lg:col-span-7 space-y-16">
               {/* Professional Gallery */}
               <div className="space-y-6">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[3.5rem] bg-slate-100 dark:bg-slate-900 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] group">
                    <Image
                      src={listing.coverUrl}
                      alt={listing.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                    <div className="absolute top-8 left-8 flex gap-3">
                       <Badge className="bg-white/90 backdrop-blur-xl text-slate-900 border-none px-5 py-2.5 font-black tracking-widest text-[10px] shadow-2xl flex items-center gap-2 rounded-2xl">
                          <Verified className="size-4 text-primary" /> INSTITUTIONAL QUALITY
                       </Badge>
                       {listing.price < 100000 && (
                          <Badge className="bg-orange-500 text-white border-none px-5 py-2.5 font-black tracking-widest text-[10px] shadow-2xl rounded-2xl">
                             HOT DEAL
                          </Badge>
                       )}
                    </div>
                  </div>
                  
                  {listing.images.length > 1 && (
                     <div className="grid grid-cols-5 gap-4">
                        {listing.images.map((img, i) => (
                           <div key={i} className="relative aspect-square rounded-[1.5rem] overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all shadow-sm">
                              <Image src={img.url} alt={`Angle ${i}`} fill className="object-cover" />
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {/* Asset Overview Section */}
               <section className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="h-12 w-1.5 rounded-full bg-primary" />
                     <h2 className="text-3xl font-black tracking-tight">Executive Summary</h2>
                  </div>
                  <div className="text-xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                     {listing.description}
                  </div>

                  {/* Trust Bar */}
                  <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-8">
                     {[
                        { icon: ShieldCheck, label: "Identity Verified" },
                        { icon: Stethoscope, label: "Vet Inspected" },
                        { icon: Scale, label: "Weight Certified" },
                        { icon: History, label: "History Cleared" }
                     ].map((t, i) => (
                        <div key={i} className="flex flex-col items-center text-center gap-3">
                           <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary border border-slate-100 dark:border-slate-800">
                              <t.icon className="size-7" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.label}</span>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Detailed Technical Specs */}
               <section className="bg-slate-900 text-white p-12 lg:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                     <div className="flex items-center justify-between mb-12">
                        <h3 className="text-3xl font-black tracking-tight">Technical Data Sheet</h3>
                        <Badge className="bg-primary/20 text-primary border-none px-4 py-2">CERTIFIED DATA</Badge>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                        {[
                           { icon: Award, label: "Breed Lineage", value: listing.breed || "Commercial Elite" },
                           { icon: Scale, label: "Certified Weight", value: "850 kg (Approx)" },
                           { icon: Calendar, label: "Asset Age", value: "24 Months" },
                           { icon: MapPin, label: "Origin Base", value: listing.location.city },
                           { icon: ShoppingBag, label: "Category", value: listing.category },
                           { icon: Info, label: "Health Status", value: "Grade A Premium" }
                        ].map((spec, i) => (
                           <div key={i} className="flex items-start gap-6 group">
                              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                 <spec.icon className="size-6" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{spec.label}</p>
                                 <p className="text-xl font-bold">{spec.value}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  {/* Decorative Background Glow */}
                  <div className="absolute top-0 right-0 h-96 w-96 bg-primary/10 blur-[120px] -z-0"></div>
               </section>
            </div>

            {/* RIGHT: Transaction Sidebar */}
            <aside className="lg:col-span-5 space-y-8">
               <div className="sticky top-12 space-y-8">
                  {/* Purchase Module */}
                  <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] border-2 border-slate-900 dark:border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           Currently Available
                        </div>
                        <FavoriteButton listingId={listing._id} className="scale-110 shadow-lg" />
                     </div>

                     <div className="mb-10">
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Valuation</span>
                        <div className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white mt-2">
                           {formatListingPrice(listing.price)}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <ListingActions listingId={listing._id} sellerId={listing.seller._id} />
                        <Button variant="outline" className="w-full h-16 rounded-full font-black text-lg border-2 border-slate-200 hover:bg-slate-50 flex items-center gap-3">
                           <Phone className="size-5" /> View Phone Authority
                        </Button>
                     </div>

                     <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4 group cursor-help">
                           <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <Info className="size-6" />
                           </div>
                           <div>
                              <p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Escrow Protected</p>
                              <p className="text-[10px] font-medium text-slate-500">Your payment is secure until delivery.</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* High-End Seller Bio */}
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative group">
                     <div className="flex items-center gap-6 mb-10">
                        <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-white rotate-2 group-hover:rotate-0 transition-transform duration-500">
                           {listing.seller.name[0]}
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-2xl font-black tracking-tight">{listing.seller.name}</h4>
                              <CheckCircle className="size-5 text-primary fill-primary/10" />
                           </div>
                           <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Master Trader · Since 2021</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-center">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reputation</p>
                           <div className="flex items-center justify-center gap-1 text-amber-500 font-black">
                              <Star className="size-3 fill-current" /> 4.9
                           </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-center">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deals Done</p>
                           <p className="font-black text-slate-900 dark:text-white text-sm">240+</p>
                        </div>
                     </div>
                     <Link href={`/profile/${listing.seller._id}`} className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary hover:gap-4 transition-all">
                        View Institutional Profile <ArrowRight className="size-4" />
                     </Link>
                  </div>

                  {/* Ad Banner */}
                  <div className="bg-primary/5 p-8 rounded-[3rem] border border-primary/20 text-center relative overflow-hidden group">
                     <Flame className="size-10 text-primary mx-auto mb-4 opacity-50 group-hover:scale-110 transition-transform" />
                     <h5 className="font-black text-lg mb-2">Want faster sales?</h5>
                     <p className="text-sm font-medium text-slate-500 mb-6">Promote your assets to 50k+ buyers daily.</p>
                     <Button variant="outline" className="rounded-full font-black text-xs uppercase tracking-widest border-primary text-primary hover:bg-primary hover:text-white transition-all">
                        Boost Your Ad
                     </Button>
                  </div>
               </div>
            </aside>
         </div>

         {/* Similar Assets (Upsell) */}
         {similarListings.length > 0 && (
            <div className="mt-32">
               <div className="flex items-center justify-between mb-16">
                  <div>
                     <h2 className="text-4xl font-black tracking-tight mb-2">Institutional <span className="text-gradient">Alternatives</span></h2>
                     <p className="text-lg text-slate-500 font-medium">Similar high-value assets matching your current discovery.</p>
                  </div>
                  <Link href={`/listings?category=${listing.category}`} className="h-14 px-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center font-black text-sm hover:bg-primary hover:text-white transition-all">
                     View Complete Catalog
                  </Link>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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


