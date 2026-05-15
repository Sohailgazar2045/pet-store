"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.")
    }
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError((json as { error?: string }).error ?? "Something went wrong. Please try again.")
        return
      }

      setSuccess(true)
      setTimeout(() => router.push("/login"), 3000)
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
            <Lock className="size-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">New password</h1>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            Choose a strong password for your account.
          </p>
        </div>

        {success ? (
          <div className="glass rounded-[2rem] p-8 text-center border-white/40 shadow-xl space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-7 text-emerald-500" />
            </div>
            <h2 className="text-xl font-black">Password updated!</h2>
            <p className="text-sm text-muted-foreground font-medium">
              Redirecting you to login…
            </p>
            <Link
              href="/login"
              className="mt-2 inline-flex items-center gap-2 text-sm font-black text-primary hover:underline"
            >
              Go to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-8 border-white/40 shadow-xl space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-black text-xs uppercase tracking-widest">
                New password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-full px-5 pr-12 bg-white/60 border-white/40 focus-visible:ring-primary/20"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="font-black text-xs uppercase tracking-widest">
                Confirm password
              </Label>
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-12 rounded-full px-5 bg-white/60 border-white/40 focus-visible:ring-primary/20"
                required
                minLength={8}
              />
            </div>

            {error && (
              <p className="text-sm text-rose-500 font-semibold">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-full font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              disabled={loading || !token}
            >
              {loading ? "Updating…" : "Set new password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
