import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { ACCESS_COOKIE_NAME } from "@/lib/auth-cookies"
import type { UserRole } from "@/types"

// ---------------------------------------------------------------------------
// In-memory rate limiter (per worker instance, good for single-node deploys).
// For multi-instance deployments, replace with an upstash/redis backed store.
// ---------------------------------------------------------------------------

interface RateWindow {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateWindow>()

/** Returns true when the request is within the allowed rate, false when exceeded. */
function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const existing = rateLimitStore.get(key)

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (existing.count >= maxRequests) return false

  existing.count++
  return true
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  )
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function getAccessToken(request: NextRequest): string | null {
  const h = request.headers.get("authorization")
  if (h?.startsWith("Bearer ")) {
    const t = h.slice(7).trim()
    if (t) return t
  }
  return request.cookies.get(ACCESS_COOKIE_NAME)?.value ?? null
}

async function verifyAccess(
  token: string
): Promise<{ sub: string; role: UserRole } | null> {
  const secret = process.env.JWT_ACCESS_SECRET
  if (!secret) {
    console.error("[middleware] JWT_ACCESS_SECRET is not set")
    return null
  }
  try {
    const key = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] })
    const sub = typeof payload.sub === "string" ? payload.sub : ""
    const role = payload.role as UserRole | undefined
    if (!sub || (role !== "user" && role !== "admin")) return null
    return { sub, role }
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Standard responses
// ---------------------------------------------------------------------------

function jsonUnauthorized() {
  return NextResponse.json(
    { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
    { status: 401 }
  )
}

function jsonForbidden() {
  return NextResponse.json(
    { success: false, error: "Forbidden", code: "FORBIDDEN" },
    { status: 403 }
  )
}

function jsonRateLimited() {
  return NextResponse.json(
    { success: false, error: "Too many requests. Please try again later.", code: "RATE_LIMITED" },
    { status: 429, headers: { "Retry-After": "60" } }
  )
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method
  const ip = getClientIp(request)

  // Rate limiting on auth mutation endpoints
  if (
    method === "POST" &&
    (pathname === "/api/auth/login" ||
      pathname === "/api/auth/register" ||
      pathname === "/api/auth/forgot-password")
  ) {
    const limits: Record<string, { max: number; windowMs: number }> = {
      "/api/auth/login": { max: 10, windowMs: 15 * 60 * 1000 },
      "/api/auth/register": { max: 5, windowMs: 60 * 60 * 1000 },
      "/api/auth/forgot-password": { max: 3, windowMs: 60 * 60 * 1000 },
    }
    const rule = limits[pathname]
    if (rule && !checkRateLimit(`${ip}:${pathname}`, rule.max, rule.windowMs)) {
      return jsonRateLimited()
    }
  }

  const token = getAccessToken(request)

  if (pathname.startsWith("/api/admin")) {
    if (!token) return jsonUnauthorized()
    const user = await verifyAccess(token)
    if (!user) return jsonUnauthorized()
    if (user.role !== "admin") return jsonForbidden()
    return NextResponse.next()
  }

  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url))
    const user = await verifyAccess(token)
    if (!user) return NextResponse.redirect(new URL("/login", request.url))
    if (user.role !== "admin") return NextResponse.redirect(new URL("/", request.url))
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/me")) {
    if (!token) return jsonUnauthorized()
    const user = await verifyAccess(token)
    if (!user) return jsonUnauthorized()
    return NextResponse.next()
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const login = new URL("/login", request.url)
      login.searchParams.set("from", pathname)
      return NextResponse.redirect(login)
    }
    const user = await verifyAccess(token)
    if (!user) {
      const login = new URL("/login", request.url)
      login.searchParams.set("from", pathname)
      return NextResponse.redirect(login)
    }
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/listings")) {
    if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
      return NextResponse.next()
    }
    if (!token) return jsonUnauthorized()
    const user = await verifyAccess(token)
    if (!user) return jsonUnauthorized()
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/conversations")) {
    if (!token) return jsonUnauthorized()
    const user = await verifyAccess(token)
    if (!user) return jsonUnauthorized()
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/messages")) {
    if (!token) return jsonUnauthorized()
    const user = await verifyAccess(token)
    if (!user) return jsonUnauthorized()
    return NextResponse.next()
  }

  if (pathname === "/api/upload") {
    if (!token) return jsonUnauthorized()
    const user = await verifyAccess(token)
    if (!user) return jsonUnauthorized()
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/me/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
    "/api/conversations",
    "/api/conversations/:path*",
    "/api/messages/:path*",
    "/api/upload",
    "/api/listings",
    "/api/listings/:path*",
  ],
}
