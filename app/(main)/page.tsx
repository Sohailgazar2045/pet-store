import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Hero } from "@/components/sections/Hero"
import { ListingCard } from "@/components/listings/ListingCard"
import { queryPublicListings } from "@/lib/listings/public-listings"
import { cn } from "@/lib/utils"
import { CheckCircle2, ShieldCheck, TrendingUp, Users, ShoppingBag, BarChart3 } from "lucide-react"

export const revalidate = 300

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home | Global Livestock & Pet Marketplace",
  description: "Explore the most trusted platform for high-quality cattle, domestic pets, and livestock. Buy and sell with confidence on PasturePro.",
}

/**
 * PasturePro marketing homepage.
 */
export default async function HomePage() {
  const { listings: featuredListings } = await queryPublicListings({ page: 1, limit: 4, sort: "views", status: "active" })

  return (
    <div className="flex flex-col">
      <Hero />
      
      {/* Market Overview Section */}
      <section className="bg-background section-padding relative overflow-hidden">
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                 <TrendingUp className="size-3" />
                 Market Intelligence
              </div>
              <h2 className="mb-4">Live Market <span className="text-gradient">Analytics</span></h2>
              <p className="text-lg font-medium text-muted-foreground">Real-time data and trends for the livestock and pet marketplace. Stay informed and make better decisions with PasturePro Insights.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="glass px-6 py-3 rounded-full text-xs font-black flex items-center gap-3 border-white/40 shadow-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE NETWORK UPDATES
              </div>
              <Link href="/reports" className="h-12 px-8 rounded-full border-2 border-primary text-primary text-sm font-black hover:bg-primary hover:text-white transition-all flex items-center">
                Download Report
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Cattle Index", value: "+2.4%", status: "up", trend: "Strong Demand", icon: <TrendingUp className="size-5" /> },
              { label: "Pet Adoption", value: "15.8%", status: "up", trend: "High Growth", icon: <Users className="size-5" /> },
              { label: "Market Volume", value: "$4.2M", status: "up", trend: "Rising", icon: <ShoppingBag className="size-5" /> },
              { label: "Success Rate", value: "94.2%", status: "stable", trend: "Consistent", icon: <BarChart3 className="size-5" /> }
            ].map((stat) => (
              <div key={stat.label} className="glass p-8 rounded-[2.5rem] border-white/40 hover:scale-105 transition-all shadow-xl group">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  {stat.icon}
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{stat.label}</p>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-3xl font-black tracking-tight">{stat.value}</span>
                  <span className={cn(
                    "text-[10px] font-black px-2 py-1 rounded-lg",
                    stat.status === "up" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                  )}>
                    {stat.status === "up" ? "↑" : "→"}
                  </span>
                </div>
                <p className="text-xs font-bold text-muted-foreground/60">{stat.trend}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] -z-10"></div>
      </section>

      {/* Featured Listings Section */}
      <section className="bg-muted/30 section-padding relative">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="mb-4">Premium <span className="text-gradient">Listings</span></h2>
              <p className="text-lg font-medium text-muted-foreground">Hand-picked premium listings from our top-rated verified sellers.</p>
            </div>
            <Link 
              href="/listings" 
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-8 h-12 font-black border-primary text-primary hover:bg-primary hover:text-white transition-all")}
            >
              Browse All Marketplace
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {featuredListings.length > 0 ? (
               featuredListings.map(listing => (
                 <ListingCard key={listing._id} listing={listing} />
               ))
             ) : (
               <div className="col-span-full py-20 text-center glass rounded-[3rem] border-dashed border-white/40 shadow-xl">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔍</div>
                  <p className="text-muted-foreground font-black text-lg">
                    No listings available at the moment.
                  </p>
                  <Link href="/listings/new" className="text-primary font-black mt-4 inline-block hover:underline">Be the first to list →</Link>
               </div>
             )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-[100px] -z-10"></div>
      </section>

      {/* Featured Categories Section */}
      <section className="bg-background section-padding overflow-hidden">
        <div className="container">
          <div className="mb-16 text-center lg:text-left">
            <h2 className="mb-4">Market <span className="text-gradient">Categories</span></h2>
            <p className="max-w-2xl text-lg font-medium text-muted-foreground">Specialized trading hubs for every need. From commercial livestock to domestic companions.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Cattle & Bulls", icon: "🐄", count: "2,500+", color: "bg-emerald-500" },
              { name: "Dogs & Puppies", icon: "🐕", count: "1,200+", color: "bg-amber-500" },
              { name: "Cats & Kittens", icon: "🐈", count: "800+", color: "bg-indigo-500" },
              { name: "Birds & Poultry", icon: "🦜", count: "450+", color: "bg-rose-500" }
            ].map((cat) => (
              <div key={cat.name} className="group relative overflow-hidden rounded-[2.5rem] bg-card p-10 shadow-sm border-white/40 hover:border-primary/20 transition-all hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:-translate-y-2 border">
                <div className={cn("mb-8 h-20 w-20 rounded-[2rem] flex items-center justify-center text-4xl group-hover:scale-110 transition-all shadow-xl text-white", cat.color)}>
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-black mb-2">{cat.name}</h3>
                <p className="text-xs font-black text-muted-foreground mb-8 uppercase tracking-[0.2em]">{cat.count} listings</p>
                <div className="inline-flex items-center text-sm font-black text-primary group-hover:translate-x-2 transition-transform">
                  Enter Hub <span className="ml-2">→</span>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Verification */}
      <section className="section-padding bg-muted/30 relative overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                 <div className="absolute inset-0 bg-primary/10 rounded-[3rem] rotate-6 animate-pulse"></div>
                 <div className="absolute inset-0 glass rounded-[4rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center border-white/50 border-4">
                    <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white mb-8 shadow-2xl shadow-primary/40">
                       <CheckCircle2 className="size-12" />
                    </div>
                    <h3 className="text-4xl font-black mb-4">Certified Safe</h3>
                    <p className="text-lg font-medium text-muted-foreground leading-relaxed">Our multi-layer verification system ensures every animal is healthy and every seller is legitimate.</p>
                 </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary mb-6">
                Premium Protocol
              </div>
              <h2 className="mb-8 leading-[1.1] text-5xl font-black">The Gold Standard of <br /><span className="text-gradient">Secure Trading</span></h2>
              <div className="space-y-10">
                {[
                  { title: "Health Verification", desc: "Every premium listing comes with verified veterinary health certificates and history." },
                  { title: "Identity Protection", desc: "Sellers are identity-verified to prevent fraud and ensure high-quality marketplace integrity." },
                  { title: "On-Site Inspection", desc: "Book a professional inspector to verify the animal's condition before finalizing any trade." }
                ].map((f) => (
                  <div key={f.title} className="flex gap-6 group">
                    <div className="h-14 w-14 rounded-2xl bg-white shadow-xl shadow-primary/5 flex-shrink-0 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                       <ShieldCheck className="size-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black mb-2 tracking-tight">{f.title}</h4>
                      <p className="text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
         <div className="container">
            <div className="glass p-20 rounded-[4rem] bg-primary text-white border-none shadow-[0_64px_128px_-16px_rgba(var(--primary),0.3)] relative overflow-hidden text-center">
               <div className="relative z-10 max-w-2xl mx-auto">
                  <h2 className="text-white text-5xl font-black mb-6 leading-tight">Ready to Find Your <br />Next Asset?</h2>
                  <p className="text-primary-foreground/80 text-xl font-medium mb-10">Join 50,000+ active users in the most trusted marketplace for livestock and pets.</p>
                  <div className="flex flex-wrap justify-center gap-4">
                     <Link href="/register" className="h-16 px-12 rounded-full bg-white text-primary font-black flex items-center hover:scale-105 transition-all shadow-2xl">
                        Create Free Account
                     </Link>
                     <Link href="/listings" className="h-16 px-12 rounded-full border-2 border-white text-white font-black flex items-center hover:bg-white hover:text-primary transition-all">
                        Browse Marketplace
                     </Link>
                  </div>
               </div>
               <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-white/10 blur-[100px]"></div>
               <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-orange-400/10 blur-[100px]"></div>
            </div>
         </div>
      </section>
    </div>
  )
}

