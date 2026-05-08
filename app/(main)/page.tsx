import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Hero } from "@/components/sections/Hero"
import { ListingCard } from "@/components/listings/ListingCard"
import { queryPublicListings } from "@/lib/listings/public-listings"
import { cn } from "@/lib/utils"
import { ShieldCheck, ShoppingBag, Globe, ArrowRight, Sparkles, Flame, Clock } from "lucide-react"

export const revalidate = 300

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PasturePro | Elite Livestock & Pet Marketplace",
  description: "The premier digital destination for high-value cattle and premium pets. Secure, verified, and professional trading for the modern market.",
}

export default async function HomePage() {
  const { listings: trendingListings } = await queryPublicListings({ 
    page: 1, 
    limit: 4, 
    sort: "views", 
    status: "active" 
  })

  const { listings: newArrivals } = await queryPublicListings({ 
    page: 1, 
    limit: 4, 
    sort: "newest", 
    status: "active" 
  })

  return (
    <div className="flex flex-col bg-[#fcfcfc] dark:bg-[#050505]">
      <Hero />
      
      {/* Category Quick Circles */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b dark:border-slate-800">
         <div className="container">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Shop by Category</h3>
               <Link href="/listings" className="text-xs font-black text-primary hover:underline">View All Departments</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8">
               {[
                  { name: "Cattle", icon: "🐄", color: "bg-emerald-500/10 text-emerald-600" },
                  { name: "Dogs", icon: "🐕", color: "bg-orange-500/10 text-orange-600" },
                  { name: "Horses", icon: "🐎", color: "bg-blue-500/10 text-blue-600" },
                  { name: "Birds", icon: "🦜", color: "bg-rose-500/10 text-rose-600" },
                  { name: "Cats", icon: "🐈", color: "bg-purple-500/10 text-purple-600" },
                  { name: "Goats", icon: "🐐", color: "bg-amber-500/10 text-amber-600" }
               ].map((cat) => (
                  <Link key={cat.name} href={`/listings?category=${cat.name.toLowerCase()}`} className="group flex flex-col items-center gap-4">
                     <div className={cn("h-24 w-24 rounded-full flex items-center justify-center text-4xl shadow-sm transition-all group-hover:scale-110 group-hover:shadow-xl", cat.color)}>
                        {cat.icon}
                     </div>
                     <span className="text-sm font-black text-slate-700 dark:text-slate-300 group-hover:text-primary">{cat.name}</span>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* Trending Deals Section */}
      <section className="py-24 container">
         <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <Flame className="size-6" />
               </div>
               <div>
                  <h2 className="text-3xl font-black tracking-tight">Trending <span className="text-orange-500">Deals</span></h2>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">High Demand Assets</p>
               </div>
            </div>
            <Link href="/listings?sort=views" className="hidden sm:flex items-center gap-2 text-sm font-black text-slate-400 hover:text-primary transition-colors">
               See All Deals <ArrowRight className="size-4" />
            </Link>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingListings.map(listing => (
               <ListingCard key={listing._id} listing={listing} />
            ))}
         </div>
      </section>

      {/* Promotional Banner */}
      <section className="container mb-24">
         <div className="relative rounded-[3.5rem] bg-slate-900 overflow-hidden p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]">
            <div className="flex-1 text-center lg:text-left z-10">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
                  <Sparkles className="size-3" /> Exclusive Verified Program
               </div>
               <h2 className="text-white text-5xl lg:text-7xl font-black mb-8 leading-[1.1]">The Gold Standard <br /> of <span className="text-primary">Verification.</span></h2>
               <p className="text-slate-400 text-xl font-medium mb-12 max-w-xl">Every premium listing on PasturePro is vet-audited and identity-verified. Trade with absolute peace of mind.</p>
               <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-16 px-10 rounded-full font-black text-lg")}>Join the Network</Link>
                  <Link href="/listings" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-16 px-10 rounded-full font-black text-lg text-white border-white/20 hover:bg-white/10")}>Learn More</Link>
               </div>
            </div>
            <div className="relative flex-1 w-full max-w-md aspect-square">
               <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
               <div className="relative h-full w-full glass rounded-[4rem] border-white/10 flex flex-col items-center justify-center p-12 text-center">
                  <ShieldCheck className="size-24 text-primary mb-8" />
                  <h3 className="text-white text-3xl font-black mb-4">Institutional Trust</h3>
                  <p className="text-slate-400 font-medium">99.8% Successful Trade Rate through our protected network.</p>
               </div>
            </div>
         </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-24 bg-slate-100 dark:bg-slate-950">
         <div className="container">
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                     <Clock className="size-6" />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black tracking-tight">New <span className="text-primary">Arrivals</span></h2>
                     <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">Freshly Added Today</p>
                  </div>
               </div>
               <Link href="/listings?sort=newest" className="hidden sm:flex items-center gap-2 text-sm font-black text-slate-400 hover:text-primary transition-colors">
                  Browse New Items <ArrowRight className="size-4" />
               </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {newArrivals.map(listing => (
                  <ListingCard key={listing._id} listing={listing} />
               ))}
            </div>
         </div>
      </section>

      {/* Benefits Trust Bar */}
      <section className="py-24 container">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
               { icon: <ShoppingBag className="size-8" />, title: "Market-Direct", desc: "No middlemen. Direct access to verified sellers and breeders worldwide." },
               { icon: <ShieldCheck className="size-8" />, title: "Secure Checkout", desc: "Multi-layer encryption for high-value transactions and data safety." },
               { icon: <Globe className="size-8" />, title: "Global Logistics", desc: "Integrated shipping support for local and international livestock transit." }
            ].map((f) => (
               <div key={f.title} className="flex flex-col gap-6 p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary">
                     {f.icon}
                  </div>
                  <h4 className="text-xl font-black tracking-tight">{f.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* Global CTA */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
         <div className="container relative z-10 text-center">
            <h2 className="text-5xl lg:text-8xl font-black mb-10 leading-none">Ready to start <br /> <span className="text-primary">trading?</span></h2>
            <p className="text-slate-400 text-xl lg:text-2xl font-medium mb-16 max-w-2xl mx-auto leading-relaxed">Join the most advanced digital livestock network on the planet.</p>
            <div className="flex flex-wrap justify-center gap-6">
               <Link href="/register" className="h-20 px-16 rounded-full bg-primary text-white font-black text-xl flex items-center hover:scale-105 transition-all shadow-2xl shadow-primary/40">
                  Create Account
               </Link>
               <Link href="/listings" className="h-20 px-16 rounded-full border-2 border-white/20 text-white font-black text-xl flex items-center hover:bg-white hover:text-slate-900 transition-all">
                  Browse Market
               </Link>
            </div>
         </div>
         {/* Background Effects */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
      </section>
    </div>
  )
}



