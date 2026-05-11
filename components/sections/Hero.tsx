"use client"

import { Search, MapPin, LayoutGrid } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PAKISTAN_MAJOR_CITIES } from "@/lib/constants/pakistan-cities"

export function Hero() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [city, setCity] = useState<string>("all")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    const q = search.trim()
    if (q) params.set("search", q)
    if (category !== "all") params.set("category", category)
    if (city !== "all") params.set("city", city)
    const qs = params.toString()
    router.push(qs ? `/listings?${qs}` : "/listings")
    router.refresh()
  }

  return (
    <section className="bg-white dark:bg-slate-950 border-b dark:border-slate-800">
      <div className="container py-12 lg:py-20">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Find the Perfect <span className="text-primary">Asset</span> Today
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Pakistan&apos;s most trusted marketplace for elite livestock and pets.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="flex flex-col lg:flex-row items-stretch gap-px bg-slate-200 dark:bg-slate-800 p-px rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 border-2 border-slate-200 dark:border-slate-800 focus-within:border-primary transition-all"
          >
            {/* Location */}
            <div className="bg-white dark:bg-slate-900 flex-1 min-w-0 flex items-center gap-3 px-4 py-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
              <MapPin className="size-5 shrink-0 text-slate-400" />
              <div className="flex-1 min-w-0 text-left space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Location
                </p>
                <Select
                  value={city}
                  onValueChange={(v) => setCity(v ?? "all")}
                >
                  <SelectTrigger className="h-auto w-full min-w-0 justify-between border-0 shadow-none bg-transparent py-0 pl-0 pr-1 font-bold text-sm rounded-none focus:ring-0 focus-visible:ring-0 data-[size=default]:h-auto gap-2">
                    <SelectValue placeholder="Pakistan — pick city" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[min(320px,70vh)] rounded-2xl border-slate-200 dark:border-slate-700 z-[100]">
                    <SelectItem value="all">Pakistan — All Cities</SelectItem>
                    {PAKISTAN_MAJOR_CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white dark:bg-slate-900 flex-1 min-w-0 flex items-center gap-3 px-4 py-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors border-y lg:border-y-0 lg:border-x border-slate-200 dark:border-slate-800">
              <LayoutGrid className="size-5 shrink-0 text-slate-400" />
              <div className="flex-1 min-w-0 text-left space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Category
                </p>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v ?? "all")}
                >
                  <SelectTrigger className="h-auto w-full min-w-0 justify-between border-0 shadow-none bg-transparent py-0 pl-0 pr-1 font-bold text-sm rounded-none focus:ring-0 focus-visible:ring-0 data-[size=default]:h-auto gap-2">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-700 z-[100]">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="cattle">Livestock / Cattle</SelectItem>
                    <SelectItem value="pets">Pets / Domestic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 flex-[2] flex items-center gap-4 px-6 py-5">
              <Search className="size-6 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Find Cattle, Dogs, Horses and more..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-base font-bold w-full min-w-0 placeholder:text-slate-400 focus:ring-0"
              />
            </div>

            <button
              type="submit"
              className="bg-primary text-white px-10 py-5 font-black text-lg hover:bg-emerald-600 transition-all flex items-center justify-center"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">
              Quick Search:
            </span>
            {["Sahiwal Cow", "German Shepherd", "Arabian Horse", "Beetal Goat"].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => router.push(`/listings?search=${encodeURIComponent(tag)}`)}
                  className="px-4 py-1.5 rounded-full border border-slate-200 text-[11px] font-bold text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all dark:border-slate-800"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
