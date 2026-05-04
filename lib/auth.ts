import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import type { UserRole } from "@/types"

const SALT_ROUNDS = 12

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return v
}

/**
 * Hashes a plaintext password with bcrypt (12 rounds).
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

/**
 * Compares a plaintext password with a stored bcrypt hash.
 */
export async function comparePassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export type AccessJwtPayload = jwt.JwtPayload & {
  sub: string
  role: UserRole
  type: "access"
}

export type RefreshJwtPayload = jwt.JwtPayload & {
  sub: string
  type: "refresh"
}

/**
 * Signs a short-lived access JWT for API authorization.
 */
export function signAccessToken(userId: string, role: UserRole): string {
  const secret = requireEnv("JWT_ACCESS_SECRET")
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m"
  return jwt.sign({ sub: userId, role, type: "access" }, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  })
}

/**
 * Signs a long-lived refresh JWT (stored client-side only as httpOnly cookie value).
 */
export function signRefreshToken(userId: string): string {
  const secret = requireEnv("JWT_REFRESH_SECRET")
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d"
  return jwt.sign({ sub: userId, type: "refresh" }, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  })
}

/**
 * Verifies an access token and returns its payload.
 * @throws jwt.JsonWebTokenError or jwt.TokenExpiredError
 */
export function verifyAccessToken(token: string): AccessJwtPayload {
  const secret = requireEnv("JWT_ACCESS_SECRET")
  const decoded = jwt.verify(token, secret) as AccessJwtPayload
  if (decoded.type !== "access" || !decoded.sub) {
    throw new jwt.JsonWebTokenError("Invalid access token payload")
  }
  return decoded
}

/**
 * Verifies a refresh token and returns its payload.
 * @throws jwt.JsonWebTokenError or jwt.TokenExpiredError
 */
export function verifyRefreshToken(token: string): RefreshJwtPayload {
  const secret = requireEnv("JWT_REFRESH_SECRET")
  const decoded = jwt.verify(token, secret) as RefreshJwtPayload
  if (decoded.type !== "refresh" || !decoded.sub) {
    throw new jwt.JsonWebTokenError("Invalid refresh token payload")
  }
  return decoded
}

/**
 * One-way hash for persisting refresh tokens in the database (rotation-safe).
 */
export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex")
}
