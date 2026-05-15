"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok && res.status !== 200) {
        const json = await res.json().catch(() => ({}))
        setError((json as { error?: string }).error ?? "Something went wrong. Please try again.")
        return
      }

      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
            <Mail className="size-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Reset password</h1>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {submitted ? (
          <div className="glass rounded-[2rem] p-8 text-center border-white/40 shadow-xl space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-7 text-emerald-500" />
            </div>
            <h2 className="text-xl font-black">Check your inbox</h2>
            <p className="text-sm text-muted-foreground font-medium">
              If an account with <strong>{email}</strong> exists, you will receive a reset link shortly.
            </p>
            <Link
              href="/login"
              className="mt-2 inline-flex items-center gap-2 text-sm font-black text-primary hover:underline"
            >
              <ArrowLeft className="size-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-8 border-white/40 shadow-xl space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-black text-xs uppercase tracking-widest">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-full px-5 bg-white/60 border-white/40 focus-visible:ring-primary/20"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-rose-500 font-semibold">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-full font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              disabled={loading}
            >
              {loading ? "Sending…" : "Send reset link"}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="size-4" />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
