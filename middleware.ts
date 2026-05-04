import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { ACCESS_COOKIE_NAME } from "@/lib/auth-cookies"
import type { UserRole } from "@/types"

/**
 * Resolves the access JWT from `Authorization: Bearer` or the httpOnly access cookie.
 */
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
    if (!sub || (role !== "user" && role !== "admin")) {
      return null
    }
    return { sub, role }
  } catch {
    return null
  }
}

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

/**
 * Route protection: dashboard (auth), admin UI + APIs (admin role), authenticated APIs.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  const token = getAccessToken(request)

  if (pathname.startsWith("/api/admin")) {
    if (!token) return jsonUnauthorized()
    const user = await verifyAccess(token)
    if (!user) return jsonUnauthorized()
    if (user.role !== "admin") return jsonForbidden()
    return NextResponse.next()
  }

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    const user = await verifyAccess(token)
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
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
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/messages/:path*",
    "/api/upload",
    "/api/listings",
    "/api/listings/:path*",
  ],
}
