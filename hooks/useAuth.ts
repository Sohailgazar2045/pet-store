"use client"

import { useCallback, useMemo } from "react"
import { toast } from "sonner"
import { apiGet, apiPost } from "@/lib/api-client"
import { useAuthStore } from "@/store/authStore"
import type { SafeUser } from "@/types"

type LoginPayload = { user: SafeUser; accessToken: string }
type MePayload = { user: SafeUser }

/**
 * Client auth: login/register/logout, session from Zustand, `ready` after bootstrap.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)
  const ready = useAuthStore((s) => s.ready)
  const setSession = useAuthStore((s) => s.setSession)
  const clearSession = useAuthStore((s) => s.clearSession)

  const isAuthenticated = Boolean(user && accessToken)

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiPost<LoginPayload>("/api/auth/login", {
        email,
        password,
      })
      if (!res.success) {
        throw new Error(res.error)
      }
      setSession(res.data.user, res.data.accessToken)
      toast.success("Signed in")
    },
    [setSession]
  )

  const register = useCallback(
    async (body: {
      name: string
      email: string
      password: string
      phone?: string
    }) => {
      const res = await apiPost<LoginPayload>("/api/auth/register", body)
      if (!res.success) {
        throw new Error(res.error)
      }
      setSession(res.data.user, res.data.accessToken)
      toast.success("Account created")
    },
    [setSession]
  )

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    clearSession()
    toast.success("Signed out")
  }, [clearSession])

  const refreshUser = useCallback(async () => {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    const res = await apiGet<MePayload>("/api/auth/me", { token })
    if (!res.success) return
    useAuthStore.setState({ user: res.data.user })
  }, [])

  return useMemo(
    () => ({
      user,
      accessToken,
      ready,
      isAuthenticated,
      isLoading: !ready,
      login,
      register,
      logout,
      refreshUser,
    }),
    [
      user,
      accessToken,
      ready,
      isAuthenticated,
      login,
      register,
      logout,
      refreshUser,
    ]
  )
}
