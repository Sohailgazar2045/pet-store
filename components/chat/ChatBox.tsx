"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Send, User, ShieldCheck } from "lucide-react"

type Message = {
  _id: string
  content: string
  sender: string
  createdAt: string
}

export function ChatBox({ conversationId }: { conversationId: string }) {
  const { user, accessToken } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/messages/${conversationId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (res.ok) {
          const data = await res.json()
          setMessages(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (accessToken) fetchMessages()
  }, [conversationId, accessToken])

  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]")
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [messages])

  async function handleSend() {
    if (!newMessage.trim()) return
    const content = newMessage.trim()
    setNewMessage("")

    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [...prev, data])
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col h-full glass rounded-[2.5rem] overflow-hidden border-white/40 shadow-2xl bg-background/50">
      <div className="p-6 border-b border-white/20 bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-white">
            <User className="size-6" />
          </div>
          <div>
            <h3 className="font-black text-lg leading-tight">PasturePro Messenger</h3>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Now
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white/40 shadow-sm">
          <ShieldCheck className="size-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Secure Chat</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-6">
          {messages.map((msg) => {
            const isMe = msg.sender === user?._id
            return (
              <div
                key={msg._id}
                className={cn(
                  "flex flex-col max-w-[85%] group",
                  isMe ? "ml-auto items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-[2rem] px-6 py-4 text-sm font-medium shadow-md transition-all",
                    isMe
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-white text-foreground rounded-tl-none border border-white/40"
                  )}
                >
                  {msg.content}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            )
          })}
          {messages.length === 0 && !loading && (
            <div className="py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4 text-2xl">👋</div>
              <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Start the conversation</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-white/20 bg-white/30">
        <div className="flex gap-3 glass p-1.5 rounded-full border-white/50 shadow-inner">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 rounded-full bg-transparent border-none focus-visible:ring-0 px-6 font-medium placeholder:text-muted-foreground/50"
          />
          <Button
            onClick={handleSend}
            className="rounded-full h-12 w-12 p-0 bg-primary shadow-lg shadow-primary/30 hover:scale-110 transition-all flex-shrink-0"
          >
            <Send className="size-5 text-white" />
          </Button>
        </div>
        <p className="text-center text-[9px] font-bold text-muted-foreground/60 mt-3 uppercase tracking-widest">
          PasturePro ensures your privacy with end-to-end encrypted messaging.
        </p>
      </div>
    </div>
  )
}
