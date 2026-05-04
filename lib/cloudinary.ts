import { Readable } from "node:stream"
import { v2 as cloudinary } from "cloudinary"

/** Folder for listing photos (must match delete guard in `/api/upload`). */
export const LISTING_IMAGE_FOLDER = "pasturepro/listings"

let configured = false

/**
 * Configures the Cloudinary SDK from env. Throws if credentials are missing.
 */
export function ensureCloudinaryConfigured(): void {
  if (configured) return
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
  const api_key = process.env.CLOUDINARY_API_KEY
  const api_secret = process.env.CLOUDINARY_API_SECRET
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be set"
    )
  }
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true })
  configured = true
}

/**
 * Uploads an image buffer to Cloudinary with max dimension 1200px and auto quality.
 */
export async function uploadListingImage(
  buffer: Buffer
): Promise<{ public_id: string; url: string }> {
  ensureCloudinaryConfigured()

  const result = await new Promise<{ public_id: string; secure_url: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: LISTING_IMAGE_FOLDER,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { fetch_format: "auto", quality: "auto" },
          ],
        },
        (err, res) => {
          if (err) reject(err)
          else if (!res?.public_id || !res.secure_url) {
            reject(new Error("Empty Cloudinary response"))
          } else {
            resolve({
              public_id: res.public_id,
              secure_url: res.secure_url,
            })
          }
        }
      )
      Readable.from(buffer).pipe(stream)
    }
  )

  return {
    public_id: result.public_id,
    url: result.secure_url,
  }
}

/**
 * Deletes an image by `public_id`. Safe if the asset is already gone.
 */
export async function deleteListingImage(publicId: string): Promise<void> {
  ensureCloudinaryConfigured()
  const res = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  })
  if (res.result !== "ok" && res.result !== "not found") {
    throw new Error(`Cloudinary destroy failed: ${String(res.result)}`)
  }
}

/**
 * Deletes Cloudinary assets only when `public_id` is under our listing folder (skips external placeholders).
 */
export async function deleteCloudinaryImagesIfOwned(
  publicIds: string[]
): Promise<void> {
  const prefix = `${LISTING_IMAGE_FOLDER}/`
  for (const id of publicIds) {
    if (!id.startsWith(prefix)) continue
    try {
      ensureCloudinaryConfigured()
      await deleteListingImage(id)
    } catch (e) {
      console.warn("[cloudinary] delete skipped", id, e)
    }
  }
}
