import type { NextResponse } from "next/server"
import { verifyAccessToken, type AccessJwtPayload } from "@/lib/auth"
import { errorJson } from "@/lib/api-response"

/**
 * Reads `Authorization: Bearer <token>` from a request.
 */
export function getBearerToken(req: Request): string | null {
  const h = req.headers.get("authorization")
  if (!h?.startsWith("Bearer ")) return null
  const t = h.slice(7).trim()
  return t || null
}

/**
 * Verifies the access JWT or returns a JSON 401 response.
 */
export function getAccessPayloadOrError(
  req: Request
): AccessJwtPayload | NextResponse {
  const token = getBearerToken(req)
  if (!token) {
    return errorJson("Missing or invalid authorization", 401, "NO_TOKEN")
  }
  try {
    return verifyAccessToken(token)
  } catch {
    return errorJson("Invalid or expired access token", 401, "INVALID_TOKEN")
  }
}

/**
 * Returns the access payload when the Bearer token is valid; otherwise `null`.
 */
export function tryAccessPayload(req: Request): AccessJwtPayload | null {
  const token = getBearerToken(req)
  if (!token) return null
  try {
    return verifyAccessToken(token)
  } catch {
    return null
  }
}

/**
 * Ensures the JWT subject is an admin (after middleware, double-check in handlers).
 */
export function requireAdminPayloadOrError(
  req: Request
): AccessJwtPayload | NextResponse {
  const gate = getAccessPayloadOrError(req)
  if (gate instanceof Response) return gate
  if (gate.role !== "admin") {
    return errorJson("Admin access required", 403, "FORBIDDEN")
  }
  return gate
}
