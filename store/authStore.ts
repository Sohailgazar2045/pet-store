import { create } from "zustand"
import type { SafeUser } from "@/types"

type AuthState = {
  user: SafeUser | null
  accessToken: string | null
  /** False until the client finishes the initial session check (refresh + /me). */
  ready: boolean
  setSession: (user: SafeUser, accessToken: string) => void
  clearSession: () => void
  setAccessToken: (accessToken: string) => void
  markReady: () => void
}

/**
 * Global auth state: user profile + access JWT for `Authorization` headers.
 * Refresh tokens stay in httpOnly cookies; bootstrap calls `POST /api/auth/refresh`.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  ready: false,
  setSession: (user, accessToken) =>
    set({ user, accessToken, ready: true }),
  clearSession: () => set({ user: null, accessToken: null, ready: true }),
  setAccessToken: (accessToken) => set({ accessToken }),
  markReady: () => set({ ready: true }),
}))
