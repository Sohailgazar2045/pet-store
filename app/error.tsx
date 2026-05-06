"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="glass max-w-xl w-full p-12 rounded-[4rem] text-center border-white/60 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="h-24 w-24 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-8 border-2 border-rose-500/20">
            <AlertCircle className="size-12 text-rose-500" />
          </div>
          <h1 className="text-4xl font-black mb-4">Something Went Wrong</h1>
          <p className="text-muted-foreground font-medium text-lg mb-10 leading-relaxed">
            An unexpected error occurred while processing your request. Our team has been notified and we're working to fix it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              onClick={() => reset()} 
              className="h-14 px-8 rounded-full bg-primary font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
            >
              <RefreshCcw className="mr-2 size-4" />
              Try Again
            </Button>
            <Link href="/">
              <Button 
                variant="outline" 
                className="h-14 px-8 rounded-full border-2 border-primary text-primary font-black uppercase tracking-widest text-xs"
              >
                <Home className="mr-2 size-4" />
                Go Home
              </Button>
            </Link>
          </div>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-12 p-6 rounded-3xl bg-black/5 text-left overflow-auto max-h-40 border border-black/5">
              <p className="font-mono text-xs text-rose-600">{error.message}</p>
            </div>
          )}
        </div>
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-rose-500/5 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
      </div>
    </div>
  )
}
