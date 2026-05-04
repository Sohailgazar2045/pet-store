"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type Message = {
  _id: string
  content: string
  sender: string
  createdAt: string
}

export function ChatBox({ conversationId }: { conversationId: string }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/messages/${conversationId}`)
        const data = await res.json()
        setMessages(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [conversationId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend() {
    if (!newMessage.trim()) return
    const content = newMessage
    setNewMessage("")
    
    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()
      setMessages(prev => [...prev, data])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col h-[500px] glass rounded-3xl overflow-hidden border-white/40">
      <div className="p-4 border-b border-white/20 bg-primary/5">
        <h3 className="font-black text-primary">Chat with Seller</h3>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={cn(
                "flex flex-col max-w-[80%] rounded-2xl p-3 text-sm font-medium",
                msg.sender === user?.id
                  ? "ml-auto bg-primary text-white"
                  : "bg-muted text-foreground"
              )}
            >
              {msg.content}
              <span className="text-[10px] opacity-50 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-white/20 flex gap-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="rounded-full bg-background/50 border-white/20"
        />
        <Button onClick={handleSend} className="rounded-full px-6 font-black">
          Send
        </Button>
      </div>
    </div>
  )
}
