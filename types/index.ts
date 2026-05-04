import type { Types } from "mongoose"

/** Application roles stored on `User.role`. */
export type UserRole = "user" | "admin"

/** Listing lifecycle status (admin moderation + sold). */
export type ListingStatus = "active" | "sold" | "pending" | "rejected"

/** Top-level listing category. */
export type ListingCategory = "cattle" | "pets"

/** Subcategories for cattle & pets. */
export type ListingSubcategory =
  | "cow"
  | "bull"
  | "calf"
  | "goat"
  | "sheep"
  | "horse"
  | "dog"
  | "cat"
  | "bird"
  | "rabbit"
  | "fish"
  | "other"

/** User profile exposed to the client (never includes password). */
export type SafeUser = {
  _id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  location?: {
    city?: string
    state?: string
    country?: string
    coordinates?: { lat?: number; lng?: number }
  }
  role: UserRole
  isVerified: boolean
  createdAt: string
}

/** Cloudinary asset attached to a listing. */
export type ListingImage = {
  public_id: string
  url: string
}

/** Standard API success envelope. */
export type ApiSuccess<T> = { success: true; data: T }

/** Standard API error envelope. */
export type ApiError = {
  success: false
  error: string
  code?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

/** JWT payload after verifying access token. */
export type AccessTokenPayload = {
  sub: string
  role: UserRole
  iat?: number
  exp?: number
}

/** Helper to stringify Mongo `_id` in JSON APIs. */
export function idToString(id: Types.ObjectId | string): string {
  return typeof id === "string" ? id : id.toString()
}
