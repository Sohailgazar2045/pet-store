"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatBox } from "@/components/chat/ChatBox"
import { cn } from "@/lib/utils"
import { MessageSquare, Search, Filter, MoreHorizontal, CheckCircle2 } from "lucide-react"

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
  const [searchQuery, setSearchQuery] = useState("")

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
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
         <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full rounded-3xl" />)}
         </div>
         <div className="lg:col-span-8">
            <Skeleton className="h-full w-full rounded-[3rem]" />
         </div>
      </div>
    )
  }

  const conversations: Conversation[] = data || []
  const filteredConversations = conversations.filter(c => {
     const other = c.participants.find(p => p._id !== user?.id)
     return other?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[750px] items-stretch">
      <div className="lg:col-span-4 glass rounded-[3rem] overflow-hidden flex flex-col border-white/40 shadow-2xl bg-white/40">
        <div className="p-8 space-y-6 border-b border-white/20 bg-white/60">
           <div className="flex items-center justify-between">
              <h3 className="font-black text-xl tracking-tight">Channels</h3>
              <div className="flex gap-2">
                 <button className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
                    <Filter className="size-4" />
                 </button>
                 <button className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
                    <MoreHorizontal className="size-4" />
                 </button>
              </div>
           </div>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-muted/50 border-none text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
              />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredConversations.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-4">
               <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30">
                  <MessageSquare className="size-8" />
               </div>
               <p className="text-sm font-black text-muted-foreground uppercase tracking-widest leading-relaxed">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const other = conv.participants.find(p => p._id !== user?.id)
              const isActive = selectedId === conv._id
              return (
                <div 
                  key={conv._id}
                  onClick={() => setSelectedId(conv._id)}
                  className={cn(
                    "p-5 rounded-[2rem] cursor-pointer transition-all duration-300 relative group",
                    isActive ? "bg-primary text-white shadow-xl shadow-primary/30" : "hover:bg-white/60 border border-transparent hover:border-white/40"
                  )}
                >
                  <div className="flex gap-4">
                    <div className={cn(
                       "h-14 w-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl font-black border-2 transition-colors",
                       isActive ? "bg-white/20 border-white/40 text-white" : "bg-muted border-white text-primary"
                    )}>
                       {other?.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between mb-1">
                          <p className="font-black truncate flex items-center gap-1.5">
                             {other?.name}
                             <CheckCircle2 className={cn("size-3", isActive ? "text-white" : "text-emerald-500")} />
                          </p>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest", isActive ? "text-white/60" : "text-muted-foreground")}>
                            {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                       <p className={cn("text-[10px] font-black uppercase tracking-widest truncate mb-1.5", isActive ? "text-white/80" : "text-primary")}>
                          {conv.listing.title}
                       </p>
                       <p className={cn("text-xs font-medium truncate", isActive ? "text-white/60" : "text-muted-foreground")}>
                        {conv.lastMessage?.content || "Tap to start negotiation"}
                       </p>
                    </div>
                  </div>
                  {isActive && (
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-white rounded-r-full shadow-[2px_0_10px_rgba(255,255,255,0.5)]"></div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="lg:col-span-8 h-full">
        {selectedId ? (
          <div className="h-full">
            <ChatBox conversationId={selectedId} />
          </div>
        ) : (
          <div className="h-full glass rounded-[3rem] border-dashed border-white/40 flex flex-col items-center justify-center text-center p-12 shadow-2xl bg-white/30 backdrop-blur-sm">
             <div className="h-24 w-24 rounded-[2rem] bg-primary/5 flex items-center justify-center text-5xl mb-8 animate-bounce duration-[3000ms]">
                <MessageSquare className="size-12 text-primary/40" />
             </div>
             <h3 className="text-3xl font-black mb-4">Channel Selection Required</h3>
             <p className="text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">
                Select a high-priority negotiation thread from the sidebar to access the encrypted communication interface.
             </p>
             <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="glass p-4 rounded-2xl text-center border-white/20">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Encrypted</p>
                   <p className="text-sm font-black text-emerald-500">AES-256</p>
                </div>
                <div className="glass p-4 rounded-2xl text-center border-white/20">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                   <p className="text-sm font-black text-primary">Secure</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}

