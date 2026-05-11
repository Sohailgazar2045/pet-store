"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
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
import { Search, SlidersHorizontal } from "lucide-react"
import { PAKISTAN_MAJOR_CITIES } from "@/lib/constants/pakistan-cities"

/**
 * Sidebar filters — local state stays in sync with the URL so Hero links and pagination work.
 */
export function ListingFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "")
    setMinPrice(searchParams.get("minPrice") ?? "")
    setMaxPrice(searchParams.get("maxPrice") ?? "")
  }, [searchParams])

  const pushFiltered = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value)
        else params.delete(key)
      }
      params.delete("page")
      const qs = params.toString()
      router.push(qs ? `/listings?${qs}` : "/listings")
      router.refresh()
    },
    [router, searchParams]
  )

  const handleFilter = (name: string, value: string) => {
    pushFiltered({ [name]: value })
  }

  const applySearch = () => {
    pushFiltered({ search: search.trim() })
  }

  const clearFilters = () => {
    router.push("/listings")
    router.refresh()
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
          type="button"
          onClick={clearFilters}
          className="h-8 px-2 text-xs font-bold text-muted-foreground hover:text-primary"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Search
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applySearch()
                }}
                className="pl-9 rounded-xl border-white/20 bg-background/50 font-medium"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 rounded-xl font-black text-xs"
              onClick={applySearch}
            >
              Go
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Category
          </Label>
          <Select
            value={searchParams.get("category") || "all"}
            onValueChange={(v) =>
              handleFilter("category", v && v !== "all" ? v : "")
            }
          >
            <SelectTrigger className="rounded-xl border-white/20 bg-background/50 font-black">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/20 z-[100]">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cattle">Livestock / Cattle</SelectItem>
              <SelectItem value="pets">Pets / Domestic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            City (Pakistan)
          </Label>
          <Select
            value={searchParams.get("city") || "all"}
            onValueChange={(v) =>
              handleFilter("city", v && v !== "all" ? v : "")
            }
          >
            <SelectTrigger className="rounded-xl border-white/20 bg-background/50 font-black">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent className="max-h-[min(280px,60vh)] rounded-xl border-white/20 z-[100]">
              <SelectItem value="all">All Cities</SelectItem>
              {PAKISTAN_MAJOR_CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Price Range (PKR)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              min={0}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={() => handleFilter("minPrice", minPrice.trim())}
              className="rounded-xl border-white/20 bg-background/50 font-medium"
            />
            <span className="text-muted-foreground font-black">—</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              min={0}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={() => handleFilter("maxPrice", maxPrice.trim())}
              className="rounded-xl border-white/20 bg-background/50 font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Sort By
          </Label>
          <Select
            value={searchParams.get("sort") || "newest"}
            onValueChange={(v) => handleFilter("sort", v ?? "newest")}
          >
            <SelectTrigger className="rounded-xl border-white/20 bg-background/50 font-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/20 z-[100]">
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
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
            Pro Tip
          </p>
          <p className="text-xs font-medium text-muted-foreground leading-relaxed">
            Verified sellers usually have 20% higher response rates. Look for the badge!
          </p>
        </div>
      </div>
    </div>
  )
}
