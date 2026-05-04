import type { Types } from "mongoose"
import type { SafeUser } from "@/types"

type UserLike = {
  _id: Types.ObjectId
  name: string
  email: string
  phone?: string | null
  avatar?: string | null
  location?: {
    city?: string | null
    state?: string | null
    country?: string | null
    coordinates?: { lat?: number | null; lng?: number | null }
  } | null
  role: SafeUser["role"]
  isVerified: boolean
  createdAt?: Date
}

/**
 * Maps a Mongoose user document to a client-safe object (no password).
 */
export function toSafeUser(doc: UserLike): SafeUser {
  const created =
    doc.createdAt instanceof Date
      ? doc.createdAt.toISOString()
      : new Date().toISOString()

  return {
    _id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    phone: doc.phone ?? undefined,
    avatar: doc.avatar ?? undefined,
    location: doc.location
      ? {
          city: doc.location.city ?? undefined,
          state: doc.location.state ?? undefined,
          country: doc.location.country ?? undefined,
          coordinates: doc.location.coordinates
            ? {
                lat: doc.location.coordinates.lat ?? undefined,
                lng: doc.location.coordinates.lng ?? undefined,
              }
            : undefined,
        }
      : undefined,
    role: doc.role,
    isVerified: doc.isVerified,
    createdAt: created,
  }
}
