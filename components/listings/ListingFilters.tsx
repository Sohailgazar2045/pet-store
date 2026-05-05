"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Professional sidebar filters for the listings page.
 */
export function ListingFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      // Reset page when filters change
      params.delete("page")
      return params.toString()
    },
    [searchParams]
  )

  const handleFilter = (name: string, value: string) => {
    router.push(`/listings?${createQueryString(name, value)}`)
  }

  const clearFilters = () => {
    router.push("/listings")
    setSearch("")
    setMinPrice("")
    setMaxPrice("")
  }

  return (
    <div className="space-y-8 glass p-6 rounded-[2rem] border-white/40 shadow-lg sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="font-black flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 px-2 text-xs font-bold text-muted-foreground hover:text-primary"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFilter("search", search)}
              className="pl-9 rounded-xl border-white/20 bg-background/50 font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</Label>
          <Select
            value={searchParams.get("category") || "all"}
            onValueChange={(v) => handleFilter("category", v === "all" ? "" : v)}
          >
            <SelectTrigger className="rounded-xl border-white/20 bg-background/50 font-black">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/20">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cattle">Livestock / Cattle</SelectItem>
              <SelectItem value="pets">Pets / Domestic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={() => handleFilter("minPrice", minPrice)}
              className="rounded-xl border-white/20 bg-background/50 font-medium"
            />
            <span className="text-muted-foreground font-black">—</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={() => handleFilter("maxPrice", maxPrice)}
              className="rounded-xl border-white/20 bg-background/50 font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sort By</Label>
          <Select
            value={searchParams.get("sort") || "newest"}
            onValueChange={(v) => handleFilter("sort", v)}
          >
            <SelectTrigger className="rounded-xl border-white/20 bg-background/50 font-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/20">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="views">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4">
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
           <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Pro Tip</p>
           <p className="text-xs font-medium text-muted-foreground leading-relaxed">
             Verified sellers usually have 20% higher response rates. Look for the badge!
           </p>
        </div>
      </div>
    </div>
  )
}
