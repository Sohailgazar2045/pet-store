"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type FavoriteButtonProps = {
  listingId: string
  initialIsFavorited?: boolean
  className?: string
}

export function FavoriteButton({ listingId, initialIsFavorited = false, className }: FavoriteButtonProps) {
  const { isAuthenticated, accessToken } = useAuth()
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [loading, setLoading] = useState(false)

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/listings/${listingId}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (res.ok) {
        const json = await res.json()
        // API returns { success: true, data: { isFavorited: boolean } }
        const next = json?.data?.isFavorited
        setIsFavorited(typeof next === "boolean" ? next : !isFavorited)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:scale-110",
        isFavorited ? "text-rose-500 bg-rose-50" : "text-muted-foreground",
        className
      )}
      onClick={toggleFavorite}
      disabled={loading}
    >
      <Heart className={cn("size-5", isFavorited && "fill-current")} />
    </Button>
  )
}
