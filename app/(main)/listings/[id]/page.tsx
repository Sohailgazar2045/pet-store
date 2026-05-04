import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { getPublicListingById } from "@/lib/listings/get-public-by-id"
import { cn, formatListingPrice } from "@/lib/utils"
import { MapPin } from "lucide-react"
import { ListingActions } from "@/components/listings/ListingActions"

export const revalidate = 300

type PageProps = {
  params: { id: string }
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

  return (
    <div className="bg-muted/30 min-h-screen py-12">
      <div className="container max-w-7xl">
        {/* Breadcrumbs / Back */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/listings"
            className="group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            <div className="h-8 w-8 rounded-full border flex items-center justify-center group-hover:bg-primary/10 transition-colors">
               ←
            </div>
            Back to Marketplace
          </Link>
          <div className="flex gap-2">
             <Badge variant="outline" className="bg-background">ID: {listing._id.slice(-6).toUpperCase()}</Badge>
             <Badge variant="outline" className="bg-background capitalize">{listing.status}</Badge>
          </div>
        </div>

        {listing.status === "pending" && (
          <div className="mb-8 glass p-4 border-amber-200 text-amber-800 flex items-center gap-3 rounded-2xl shadow-lg">
            <div className="h-10 w-10 rounded-full bg-amber-500 flex-shrink-0 flex items-center justify-center text-white font-bold">!</div>
            <p className="text-sm font-medium">
              This listing is <strong>pending review</strong>. It will appear publicly once approved by an admin.
            </p>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Images & Description */}
          <div className="lg:col-span-8 space-y-12">
            {/* Image Section */}
            <div className="space-y-4">
               <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2.5rem] shadow-2xl bg-muted border-4 border-white">
                <Image
                  src={listing.coverUrl}
                  alt={listing.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              {listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                   {listing.images.slice(0, 4).map((img, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-2 border-white cursor-pointer hover:scale-105 transition-transform">
                         <Image src={img.url} alt={`Photo ${i}`} fill className="object-cover" />
                      </div>
                   ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="glass p-10 rounded-[2.5rem] shadow-xl space-y-10 border-white/40">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                   <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={cn("px-4 py-1 font-black uppercase tracking-widest", isCattle ? "bg-emerald-500 text-white" : "bg-amber-500 text-white")}>
                        {listing.category}
                      </Badge>
                      <Badge variant="secondary" className="px-4 py-1 font-black uppercase tracking-widest bg-muted text-muted-foreground">
                        {listing.subcategory}
                      </Badge>
                   </div>
                   <h1 className="text-4xl font-black mb-3">{listing.title}</h1>
                   <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="size-5 text-primary" />
                      <span className="font-bold">{listing.location.city}, {listing.location.state}</span>
                      <span className="h-1 w-1 rounded-full bg-muted"></span>
                      <span className="text-xs font-bold uppercase tracking-widest">{listing.views} views</span>
                   </div>
                </div>
                <div className="text-3xl font-black text-primary bg-primary/5 px-8 py-4 rounded-3xl">
                   {formatListingPrice(listing.price)}
                </div>
              </div>

              <div className="border-t border-white/20 pt-10">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <span className="h-8 w-1.5 rounded-full bg-primary"></span>
                  Details & Specs
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {[
                    { label: "Breed", value: listing.breed ?? "Not specified" },
                    { label: "Category", value: listing.category },
                    { label: "Subcategory", value: listing.subcategory },
                    { label: "Listed on", value: new Date(listing.createdAt).toLocaleDateString() },
                    { label: "Location", value: listing.location.city },
                    { label: "Condition", value: "Verified Healthy" }
                  ].map((spec) => (
                    <div key={spec.label} className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{spec.label}</p>
                       <p className="font-bold text-foreground">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/20 pt-10">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <span className="h-8 w-1.5 rounded-full bg-primary"></span>
                  Description
                </h2>
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
                  {listing.description}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Seller & Action */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="glass p-8 rounded-[2.5rem] shadow-xl border-white/40 sticky top-24">
              <div className="text-center mb-8">
                 <div className="h-24 w-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-4xl font-black text-primary border-4 border-white mb-4">
                    {listing.seller.name[0]}
                 </div>
                 <h3 className="text-2xl font-black">{listing.seller.name}</h3>
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Verified Member</p>
                 <div className="mt-4 flex items-center justify-center gap-1 text-amber-500">
                    {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                    <span className="text-xs font-bold text-muted-foreground ml-2">(12 reviews)</span>
                 </div>
              </div>

              <ListingActions listingId={listing._id} sellerId={listing.seller._id} />

              <div className="mt-8 pt-8 border-t border-white/20">
                 <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-muted-foreground">Joined</span>
                    <span>Jan 2024</span>
                 </div>
                 <div className="flex items-center justify-between text-sm font-bold mt-3">
                    <span className="text-muted-foreground">Response Rate</span>
                    <span className="text-emerald-500">98%</span>
                 </div>
              </div>
            </div>

            <div className="glass p-8 rounded-[2.5rem] shadow-lg border-white/40">
               <h4 className="text-lg font-black mb-4">Safety Tips</h4>
               <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">1.</span>
                    Always meet in a public, safe place.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">2.</span>
                    Inspect the animal before making any payment.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">3.</span>
                    Use our in-platform chat for a record of trade.
                  </li>
               </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
