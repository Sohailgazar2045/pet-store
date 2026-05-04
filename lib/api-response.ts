import { NextResponse } from "next/server"
import type { ApiError, ApiResponse, ApiSuccess } from "@/types"

/**
 * JSON success response with HTTP status.
 */
export function successJson<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status })
}

/**
 * JSON error response with optional machine-readable `code`.
 */
export function errorJson(
  error: string,
  status: number,
  code?: string
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error, ...(code ? { code } : {}) },
    { status }
  )
}

export type { ApiResponse }
