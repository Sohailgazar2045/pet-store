import fs from "node:fs/promises"
import path from "node:path"
import { randomUUID } from "node:crypto"

/** Path to the uploads directory in the public folder. */
export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "listings")

/**
 * Saves an image buffer to the local filesystem.
 */
export async function saveListingImage(
  buffer: Buffer,
  extension: string = "webp"
): Promise<{ public_id: string; url: string }> {
  // Ensure directory exists
  await fs.mkdir(UPLOADS_DIR, { recursive: true })

  const filename = `${randomUUID()}.${extension}`
  const filePath = path.join(UPLOADS_DIR, filename)

  await fs.writeFile(filePath, buffer)

  // public_id will be the filename for local storage
  // url will be the relative path from public root
  return {
    public_id: filename,
    url: `/uploads/listings/${filename}`,
  }
}

/**
 * Deletes an image from the local filesystem.
 */
export async function removeListingImage(filename: string): Promise<void> {
  const filePath = path.join(UPLOADS_DIR, filename)
  try {
    await fs.unlink(filePath)
  } catch (e: unknown) {
    if (e instanceof Error && 'code' in e && (e as NodeJS.ErrnoException).code !== "ENOENT") {
      throw e
    }
  }
}

/**
 * Deletes multiple local assets. Safe if the asset is already gone.
 */
export async function removeLocalImages(filenames: string[]): Promise<void> {
  for (const filename of filenames) {
    try {
      await removeListingImage(filename)
    } catch (e) {
      console.warn("[storage] delete skipped", filename, e)
    }
  }
}
