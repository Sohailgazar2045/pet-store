"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { ChatBox } from "@/components/chat/ChatBox"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

type ListingActionsProps = {
  listingId: string
  sellerId: string
}

export function ListingActions({ listingId, sellerId }: ListingActionsProps) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleMessageClick() {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.id === sellerId) {
      alert("You cannot message yourself.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        body: JSON.stringify({ listingId, sellerId }),
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()
      setConversationId(data._id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="w-full h-14 rounded-full text-lg font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all"
            onClick={handleMessageClick}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Message Seller"}
          </Button>
        </DialogTrigger>
        {conversationId && (
          <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[2.5rem] border-none bg-transparent">
             <ChatBox conversationId={conversationId} />
          </DialogContent>
        )}
      </Dialog>
      
      <Button variant="outline" className="w-full h-14 rounded-full text-lg font-black hover:bg-muted transition-all">
        Call Seller
      </Button>
    </div>
  )
}
