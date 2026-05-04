import type { ListingImage } from "@/types"

/**
 * Shared placeholder for listings (Cloudinary). Used in seed data and as a UI fallback
 * when a listing has no `images` yet.
 */
export const DEFAULT_LISTING_IMAGE: ListingImage = {
  public_id: "growth-genie-uploads/vmwj7rhhcvxilcpmevju",
  url: "https://res.cloudinary.com/dh8tx091t/image/upload/v1774346322/growth-genie-uploads/vmwj7rhhcvxilcpmevju.jpg",
}
