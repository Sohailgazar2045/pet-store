/** Allowed image MIME types for uploads (validated via magic bytes). */
export const ALLOWED_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

export type AllowedImageMime = (typeof ALLOWED_IMAGE_MIME)[number]

const MAX_MAGIC_LEN = 16

/**
 * Detects image type from file header bytes (do not trust `Content-Type` alone).
 */
export function detectImageMimeFromBytes(buf: Buffer): AllowedImageMime | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg"
  }
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "image/png"
  }
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp"
  }
  return null
}

/**
 * Returns true if the buffer looks like a supported image (reads only a prefix).
 */
export function isProbablyAllowedImage(buffer: Buffer): boolean {
  const slice = buffer.subarray(0, MAX_MAGIC_LEN)
  return detectImageMimeFromBytes(slice) !== null
}
