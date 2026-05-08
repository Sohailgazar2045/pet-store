"use client"

import Link from "next/link"
import { Search, MapPin, ChevronDown, LayoutGrid } from "lucide-react"
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
    <section className="bg-white dark:bg-slate-950 border-b dark:border-slate-800">
      <div className="container py-12 lg:py-20">
        <div className="flex flex-col items-center text-center mb-12">
           <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
             Find the Perfect <span className="text-primary">Asset</span> Today
           </h1>
           <p className="text-slate-500 font-medium text-lg">Pakistan's most trusted marketplace for elite livestock and pets.</p>
        </div>

        {/* OLX-Style Search Bar (Premium Version) */}
        <div className="max-w-5xl mx-auto">
           <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch gap-px bg-slate-200 dark:bg-slate-800 p-px rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 border-2 border-slate-200 dark:border-slate-800 focus-within:border-primary transition-all">
              
              {/* Location Selector */}
              <div className="bg-white dark:bg-slate-900 flex-1 flex items-center gap-3 px-6 py-5 group cursor-pointer hover:bg-slate-50 transition-colors">
                 <MapPin className="size-5 text-slate-400 group-hover:text-primary transition-colors" />
                 <div className="flex-1 text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                    <div className="flex items-center justify-between">
                       <span className="font-bold text-sm">Pakistan, All Cities</span>
                       <ChevronDown className="size-4 text-slate-400" />
                    </div>
                 </div>
              </div>

              {/* Category Selector */}
              <div className="bg-white dark:bg-slate-900 flex-1 flex items-center gap-3 px-6 py-5 group cursor-pointer hover:bg-slate-50 transition-colors">
                 <LayoutGrid className="size-5 text-slate-400 group-hover:text-primary transition-colors" />
                 <div className="flex-1 text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</p>
                    <div className="flex items-center justify-between">
                       <span className="font-bold text-sm">All Categories</span>
                       <ChevronDown className="size-4 text-slate-400" />
                    </div>
                 </div>
              </div>

              {/* Search Input */}
              <div className="bg-white dark:bg-slate-900 flex-[2] flex items-center gap-4 px-6 py-5">
                 <Search className="size-6 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="Find Cattle, Dogs, Horses and more..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-base font-bold w-full placeholder:text-slate-400 focus:ring-0"
                 />
              </div>

              {/* Search Button */}
              <button type="submit" className="bg-primary text-white px-10 py-5 font-black text-lg hover:bg-emerald-600 transition-all flex items-center justify-center">
                 Search
              </button>
           </form>

           {/* Quick Suggestion Chips */}
           <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Quick Search:</span>
              {["Sahiwal Cow", "German Shepherd", "Arabian Horse", "Beetal Goat"].map((tag) => (
                 <button 
                    key={tag}
                    onClick={() => router.push(`/listings?search=${tag}`)}
                    className="px-4 py-1.5 rounded-full border border-slate-200 text-[11px] font-bold text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all dark:border-slate-800"
                 >
                    {tag}
                 </button>
              ))}
           </div>
        </div>
      </div>
    </section>
  )
}



