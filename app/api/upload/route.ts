import { getAccessPayloadOrError } from "@/lib/request-auth"
import {
  deleteListingImage,
  ensureCloudinaryConfigured,
  LISTING_IMAGE_FOLDER,
  uploadListingImage,
} from "@/lib/cloudinary"
import { successJson, errorJson } from "@/lib/api-response"
import { detectImageMimeFromBytes } from "@/lib/image-bytes"
import { deleteUploadSchema } from "@/lib/validations/upload.schema"

export const runtime = "nodejs"

const MAX_FILES = 8
const MAX_BYTES = 5 * 1024 * 1024

/** Only assets under this folder may be deleted via this API. */
const LISTING_PUBLIC_ID_PREFIX = `${LISTING_IMAGE_FOLDER}/`

/**
 * POST /api/upload — multipart `files` (up to 8), JPEG/PNG/WebP, 5MB each.
 * Requires `Authorization: Bearer <access_token>`.
 */
export async function POST(req: Request) {
  const denied = getAccessPayloadOrError(req)
  if (denied instanceof Response) return denied

  try {
    ensureCloudinaryConfigured()
  } catch {
    return errorJson(
      "Image upload is not configured (Cloudinary env vars)",
      503,
      "CLOUDINARY_CONFIG"
    )
  }

  const ct = req.headers.get("content-type") ?? ""
  if (!ct.includes("multipart/form-data")) {
    return errorJson(
      "Expected multipart/form-data",
      400,
      "INVALID_CONTENT_TYPE"
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return errorJson("Invalid multipart body", 400, "INVALID_FORM")
  }

  const entries = formData.getAll("files")
  const files: File[] = []
  for (const item of entries) {
    if (item instanceof File && item.size > 0) files.push(item)
  }
  if (files.length === 0) {
    const single = formData.get("file")
    if (single instanceof File && single.size > 0) files.push(single)
  }

  if (files.length === 0) {
    return errorJson(
      "No image files (use field name `files` or `file`)",
      400,
      "NO_FILES"
    )
  }
  if (files.length > MAX_FILES) {
    return errorJson(`Maximum ${MAX_FILES} images per request`, 400, "TOO_MANY_FILES")
  }

  const images: { public_id: string; url: string }[] = []

  for (const file of files) {
    if (file.size > MAX_BYTES) {
      return errorJson(
        `Each file must be at most 5MB (${file.name})`,
        400,
        "FILE_TOO_LARGE"
      )
    }

    const buf = Buffer.from(await file.arrayBuffer())
    const detected = detectImageMimeFromBytes(buf)
    if (!detected) {
      return errorJson(
        "Only JPEG, PNG, and WebP images are allowed",
        400,
        "INVALID_IMAGE_TYPE"
      )
    }
    if (file.type && file.type.startsWith("image/")) {
      const declared = file.type === "image/jpg" ? "image/jpeg" : file.type
      if (declared !== detected) {
        return errorJson(
          "File content does not match its declared type",
          400,
          "MIME_MISMATCH"
        )
      }
    }

    try {
      images.push(await uploadListingImage(buf))
    } catch (e) {
      console.error("[upload] Cloudinary error", e)
      return errorJson("Failed to upload image", 500, "UPLOAD_FAILED")
    }
  }

  return successJson({ images })
}

/**
 * DELETE /api/upload — body `{ "public_id": "pasturepro/listings/..." }`.
 */
export async function DELETE(req: Request) {
  const denied = getAccessPayloadOrError(req)
  if (denied instanceof Response) return denied

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorJson("Invalid JSON body", 400, "INVALID_JSON")
  }

  const parsed = deleteUploadSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Validation failed"
    return errorJson(msg, 400, "VALIDATION_ERROR")
  }

  const { public_id: publicId } = parsed.data
  if (!publicId.startsWith(LISTING_PUBLIC_ID_PREFIX)) {
    return errorJson(
      "You can only delete listing images from this app folder",
      403,
      "FORBIDDEN_PUBLIC_ID"
    )
  }

  try {
    ensureCloudinaryConfigured()
  } catch {
    return errorJson(
      "Image service not configured (Cloudinary env vars)",
      503,
      "CLOUDINARY_CONFIG"
    )
  }

  try {
    await deleteListingImage(publicId)
  } catch (e) {
    console.error("[upload] delete error", e)
    return errorJson("Failed to delete image", 500, "DELETE_FAILED")
  }

  return successJson({ deleted: true })
}
