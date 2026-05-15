import fs from "node:fs/promises"
import path from "node:path"
import { randomUUID } from "node:crypto"

export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "listings")

/** Validates that `filename` is a safe bare filename (no path traversal). */
function assertSafeFilename(filename: string): void {
  const base = path.basename(filename)
  if (base !== filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    throw new Error(`Unsafe filename rejected: ${filename}`)
  }
}

export async function saveListingImage(
  buffer: Buffer,
  extension: string = "webp"
): Promise<{ public_id: string; url: string }> {
  await fs.mkdir(UPLOADS_DIR, { recursive: true })

  const filename = `${randomUUID()}.${extension}`
  const filePath = path.join(UPLOADS_DIR, filename)

  await fs.writeFile(filePath, buffer)

  return {
    public_id: filename,
    url: `/uploads/listings/${filename}`,
  }
}

export async function removeListingImage(filename: string): Promise<void> {
  assertSafeFilename(filename)
  const filePath = path.join(UPLOADS_DIR, filename)
  try {
    await fs.unlink(filePath)
  } catch (e: unknown) {
    if (
      e instanceof Error &&
      "code" in e &&
      (e as NodeJS.ErrnoException).code !== "ENOENT"
    ) {
      throw e
    }
  }
}

export async function removeLocalImages(filenames: string[]): Promise<void> {
  for (const filename of filenames) {
    try {
      await removeListingImage(filename)
    } catch (e) {
      console.warn("[storage] delete skipped", filename, e)
    }
  }
}
