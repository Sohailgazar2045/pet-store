"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import type { ApiResponse } from "@/types"
import type { SafeUser } from "@/types"

/**
 * On load: attempts `POST /api/auth/refresh` then `GET /api/auth/me` to restore session from cookies.
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        })
        if (cancelled) return
        if (!refreshRes.ok) {
          useAuthStore.getState().markReady()
          return
        }

        const refreshJson =
          (await refreshRes.json()) as ApiResponse<{ accessToken: string }>
        if (
          !refreshJson.success ||
          !refreshJson.data ||
          typeof refreshJson.data.accessToken !== "string"
        ) {
          useAuthStore.getState().markReady()
          return
        }

        const token = refreshJson.data.accessToken
        const meRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        })
        if (cancelled) return
        const meJson = (await meRes.json()) as ApiResponse<{ user: SafeUser }>
        if (!meJson.success || !meJson.data?.user) {
          useAuthStore.getState().markReady()
          return
        }

        useAuthStore.getState().setSession(meJson.data.user, token)
      } catch {
        if (!cancelled) useAuthStore.getState().markReady()
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return <>{children}</>
}
