"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, ArrowRight, ShieldCheck, Star, ShoppingBag, Zap } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function Hero() {
  const [search, setSearch] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/listings?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <section className="relative overflow-hidden bg-slate-50 pt-12 pb-24 lg:pt-24 lg:pb-40 dark:bg-slate-950">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full"></div>
         <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-white mb-10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
              <Zap className="size-3 text-orange-400 fill-orange-400" />
              Limited Time: Free Asset Verification
            </div>
            
            <h1 className="mb-8 font-black text-6xl lg:text-8xl tracking-tight leading-[1] text-slate-900 dark:text-white">
              The World's <br />
              <span className="text-gradient">Premier Market</span>
            </h1>
            
            <p className="mb-12 max-w-xl text-lg text-slate-600 sm:text-2xl mx-auto lg:mx-0 leading-relaxed font-medium dark:text-slate-400">
              Direct access to the globe's finest livestock and elite pets. Trade with institutional security and precision.
            </p>

            {/* Commercial Search Hub */}
            <div className="max-w-2xl w-full mb-10">
               <form onSubmit={handleSearch} className="group glass p-2.5 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] flex items-center gap-2 border-2 border-white bg-white/90 dark:bg-slate-900/90 dark:border-slate-800 focus-within:border-primary transition-all">
                 <div className="flex-[1.5] flex items-center gap-4 px-6 border-r border-slate-200 dark:border-slate-800">
                   <Search className="size-6 text-primary" />
                   <input 
                     type="text" 
                     placeholder="Search Cattle, Pets, or Breeds..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="bg-transparent border-none outline-none text-base font-bold w-full placeholder:text-slate-400 focus:ring-0"
                   />
                 </div>
                 <button type="submit" className="h-14 px-12 rounded-[1.8rem] bg-slate-900 text-white text-base font-black shadow-xl hover:bg-primary transition-all flex items-center gap-2">
                   Explore <ArrowRight className="size-5" />
                 </button>
               </form>
            </div>

            {/* Quick Categories */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Top Categories:</span>
               {[
                  { name: "Sahiwal Cattle", icon: "🐄" },
                  { name: "German Shepherds", icon: "🐕" },
                  { name: "Arabian Horses", icon: "🐎" },
                  { name: "Show Poultry", icon: "🦜" }
               ].map((cat) => (
                  <Link key={cat.name} href={`/listings?search=${cat.name}`} className="px-5 py-2 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-primary hover:text-primary hover:shadow-lg transition-all dark:bg-slate-900 dark:border-slate-800">
                     <span className="mr-2">{cat.icon}</span> {cat.name}
                  </Link>
               ))}
            </div>
          </div>
          
          <div className="relative flex-1 lg:max-w-2xl w-full">
            <div className="relative aspect-square w-full rounded-[4rem] overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.3)] border-8 border-white dark:border-slate-800 animate-in fade-in zoom-in duration-1000 group">
              <Image
                src="/hero-main.png"
                alt="PasturePro Elite Marketplace"
                fill
                priority
                className="object-cover transition-transform duration-[20s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-transparent to-transparent"></div>
              
              {/* Product Info Overlay */}
              <div className="absolute bottom-10 left-10 flex items-center gap-4 animate-in slide-in-from-left-10 duration-1000 delay-500">
                 <div className="h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white text-3xl shadow-2xl">
                    <ShoppingBag className="size-10" />
                 </div>
                 <div className="text-white">
                    <p className="text-2xl font-black tracking-tight leading-none">Global Network</p>
                    <p className="text-sm font-medium opacity-80 mt-1">Live Asset Exchange</p>
                 </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute top-10 right-10 flex flex-col items-center gap-1 glass px-6 py-4 rounded-[2rem] shadow-2xl border-white/40">
                 <ShieldCheck className="size-10 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary">Secure Pay</span>
              </div>
            </div>

            {/* Floating Accents */}
            <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-[100px] -z-10"></div>
            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px] -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}



