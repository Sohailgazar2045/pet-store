import { Types } from "mongoose"
import { connectDB } from "@/lib/db"
import { Listing } from "@/models/Listing"
import { serializePublicListing, type PublicListing } from "@/lib/listings/public-listings"

/**
 * Loads one listing by id, increments `views`, populates seller fields.
 */
export async function getPublicListingById(
  id: string
): Promise<PublicListing | null> {
  if (!Types.ObjectId.isValid(id)) {
    return null
  }

  await connectDB()

  const doc = await Listing.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $inc: { views: 1 } },
    { new: true, lean: true }
  ).populate("seller", "name phone avatar location createdAt")

  if (!doc) {
    return null
  }

  return serializePublicListing(doc as Record<string, unknown>)
}
