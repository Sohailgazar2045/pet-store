"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, MapPin } from "lucide-react"
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
    <section className="relative overflow-hidden bg-background section-padding">
      <div className="container relative z-10">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 text-center lg:text-left pt-4">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Safe & Trusted Marketplace
            </div>
            <h1 className="mb-6 max-w-2xl font-black">
              Find Your New <br />
              <span className="text-gradient">Best Companion</span> <br />
              Near You
            </h1>
            <p className="mb-10 max-w-lg text-lg text-muted-foreground sm:text-xl mx-auto lg:mx-0 text-pretty">
              The premier marketplace for pets and livestock. Browse thousands of verified listings and connect with trusted sellers in your community.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start mb-10">
              <Link
                href="/listings"
                className={cn(buttonVariants({ size: "lg" }), "h-14 px-10 text-lg shadow-2xl shadow-primary/30 rounded-full hover:scale-105 transition-all font-black")}
              >
                Explore Listings
              </Link>
              <Link
                href="/listings/new"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 px-10 text-lg rounded-full hover:bg-muted transition-all font-black")}
              >
                Post an Ad
              </Link>
            </div>

            {/* Smart Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl w-full glass p-2 rounded-full shadow-2xl hidden md:flex items-center gap-2 border border-white/40">
              <div className="flex-1 flex items-center gap-3 px-4 border-r border-muted">
                <Search className="size-5 text-primary" />
                <input 
                  type="text" 
                  placeholder="Search breed, city, or keyword..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex items-center gap-2 px-4">
                <MapPin className="size-5 text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">Nearby</span>
              </div>
              <button type="submit" className="h-11 px-6 rounded-full bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                Search
              </button>
            </form>
            
            <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 lg:justify-start">
              {[
                { label: "Listings", value: "12,000+" },
                { label: "Active Users", value: "50,000+" },
                { label: "Successful Deals", value: "8,000+" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-black text-foreground">{stat.value}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative flex-1 lg:max-w-xl w-full animate-in fade-in slide-in-from-right-12 duration-1000">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
              <Image
                src="/hero-pet.png"
                alt="Happy Pets"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/50 shadow-lg relative">
                    <Image src="/lifestyle-pet.png" alt="User" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-foreground leading-none">Buddy (Retriever)</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Available Now • Lahore</p>
                  </div>
                  <div className="text-primary font-black text-lg">$850</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] -z-10 animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-400/10 blur-[100px] -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

