"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"
import { apiGet } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatBox } from "@/components/chat/ChatBox"
import { cn } from "@/lib/utils"
import Image from "next/image"

type Conversation = {
  _id: string
  participants: { _id: string; name: string; avatar?: string }[]
  listing: { title: string; coverUrl: string; price: number }
  lastMessage?: { content: string; createdAt: string }
  updatedAt: string
}

export function MessagesInbox() {
  const { accessToken, user } = useAuth()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data, isPending } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations", {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      return res.json()
    },
    enabled: Boolean(accessToken)
  })

  if (isPending) {
    return <div className="space-y-4"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>
  }

  const conversations: Conversation[] = data || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
      <div className="lg:col-span-4 glass rounded-[2rem] overflow-hidden flex flex-col border-white/40 shadow-xl">
        <div className="p-6 border-b border-white/20 bg-primary/5">
           <h3 className="font-black text-lg">Your Inbox</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground font-medium">No messages yet.</div>
          ) : (
            conversations.map((conv) => {
              const other = conv.participants.find(p => p._id !== user?.id)
              return (
                <div 
                  key={conv._id}
                  onClick={() => setSelectedId(conv._id)}
                  className={cn(
                    "p-6 border-b border-white/10 cursor-pointer transition-all hover:bg-primary/5",
                    selectedId === conv._id && "bg-primary/10 border-l-4 border-l-primary"
                  )}
                >
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-xl font-black text-primary border-2 border-white">
                       {other?.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between mb-1">
                          <p className="font-black truncate">{other?.name}</p>
                          <span className="text-[10px] text-muted-foreground font-bold">
                            {new Date(conv.updatedAt).toLocaleDateString()}
                          </span>
                       </div>
                       <p className="text-xs font-black text-primary truncate mb-1">{conv.listing.title}</p>
                       <p className="text-xs text-muted-foreground truncate font-medium">
                        {conv.lastMessage?.content || "Start a conversation"}
                       </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="lg:col-span-8">
        {selectedId ? (
          <ChatBox conversationId={selectedId} />
        ) : (
          <div className="h-full glass rounded-[2.5rem] border-dashed border-white/40 flex flex-col items-center justify-center text-center p-12 shadow-xl">
             <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl mb-6">💬</div>
             <h3 className="text-2xl font-black mb-2">Your Conversations</h3>
             <p className="text-muted-foreground font-medium max-w-xs mx-auto">Select a chat from the sidebar to start messaging buyers and sellers.</p>
          </div>
        )}
      </div>
    </div>
  )
}
