import { connectDB } from "@/lib/db"
import { Listing } from "@/models/Listing"
import { DEFAULT_LISTING_IMAGE } from "@/lib/constants/default-listing-image"
import type { ListingsQuery } from "@/lib/validations/listing.query"
import type { ListingImage, ListingStatus } from "@/types"

export type PublicListingSeller = {
  _id: string
  name: string
  phone?: string
  avatar?: string
  location?: { city?: string; state?: string; country?: string }
  createdAt?: string
}

export type PublicListing = {
  _id: string
  title: string
  description: string
  price: number
  category: "cattle" | "pets"
  subcategory: string
  breed?: string
  status: ListingStatus
  views: number
  isFeatured: boolean
  images: ListingImage[]
  coverUrl: string
  location: {
    city: string
    state: string
    country: string
  }
  seller: PublicListingSeller
  createdAt: string
  tags: string[]
}

const sortMap = {
  newest: { createdAt: -1 as const },
  price_asc: { price: 1 as const },
  price_desc: { price: -1 as const },
  views: { views: -1 as const },
}

/**
 * Runs the public listings query (filters + pagination + population).
 */
export async function queryPublicListings(
  q: ListingsQuery
): Promise<{
  listings: PublicListing[]
  total: number
  page: number
  pages: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}> {
  await connectDB()

  const page = q.page
  const limit = q.limit
  const skip = (page - 1) * limit

  const filter: Record<string, unknown> = {
    status: q.status,
  }

  if (q.category) filter.category = q.category

  if (q.subcategory?.trim()) {
    const subs = q.subcategory
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    if (subs.length > 0) {
      filter.subcategory = { $in: subs }
    }
  }

  if (q.city?.trim()) {
    filter["location.city"] = new RegExp(q.city.trim(), "i")
  }

  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    const price: { $gte?: number; $lte?: number } = {}
    if (q.minPrice !== undefined) price.$gte = q.minPrice
    if (q.maxPrice !== undefined) price.$lte = q.maxPrice
    filter.price = price
  }

  const search = q.search?.trim()
  if (search) {
    filter.$text = { $search: search }
  }

  const sort = sortMap[q.sort] ?? sortMap.newest

  const [docs, total] = await Promise.all([
    Listing.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("seller", "name phone avatar location createdAt")
      .lean(),
    Listing.countDocuments(filter),
  ])

  const pages = Math.max(1, Math.ceil(total / limit))
  const listings = docs.map((doc) => serializePublicListing(doc))

  return {
    listings,
    total,
    page,
    pages,
    limit,
    hasNext: page < pages,
    hasPrev: page > 1,
  }
}

/** Maps a lean listing document (e.g. from Mongo) to the public API shape. */
export function serializePublicListing(doc: Record<string, unknown>): PublicListing {
  const sellerDoc = doc.seller as
    | {
        _id: unknown
        name?: string
        phone?: string
        avatar?: string
        location?: { city?: string; state?: string; country?: string }
        createdAt?: Date
      }
    | null
    | undefined

  const imagesRaw = doc.images as ListingImage[] | undefined
  const images =
    imagesRaw && imagesRaw.length > 0 ? imagesRaw : [DEFAULT_LISTING_IMAGE]

  const coverUrl = images[0]?.url ?? DEFAULT_LISTING_IMAGE.url

  const seller: PublicListingSeller = sellerDoc
    ? {
        _id: String(sellerDoc._id),
        name: sellerDoc.name ?? "Seller",
        phone: sellerDoc.phone ?? undefined,
        avatar: sellerDoc.avatar ?? undefined,
        location: sellerDoc.location ?? undefined,
        createdAt:
          sellerDoc.createdAt instanceof Date
            ? sellerDoc.createdAt.toISOString()
            : undefined,
      }
    : {
        _id: "",
        name: "Unknown",
      }

  return {
    _id: String(doc._id),
    title: String(doc.title ?? ""),
    description: String(doc.description ?? ""),
    price: Number(doc.price ?? 0),
    category: doc.category as "cattle" | "pets",
    subcategory: String(doc.subcategory ?? ""),
    breed: doc.breed ? String(doc.breed) : undefined,
    status: doc.status as ListingStatus,
    views: Number(doc.views ?? 0),
    isFeatured: Boolean(doc.isFeatured),
    images,
    coverUrl,
    location: {
      city: String((doc.location as { city?: string })?.city ?? ""),
      state: String((doc.location as { state?: string })?.state ?? ""),
      country: String((doc.location as { country?: string })?.country ?? ""),
    },
    seller,
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : new Date().toISOString(),
    tags: Array.isArray(doc.tags) ? (doc.tags as string[]) : [],
  }
}
