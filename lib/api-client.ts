import type { ApiResponse } from "@/types"

const JSON_HEADERS = { "Content-Type": "application/json" }

type FetchOpts = {
  token?: string | null
}

/**
 * POST JSON and parse `{ success, data | error }` envelope.
 */
export async function apiPost<TData, TBody extends object = Record<string, unknown>>(
  path: string,
  body: TBody,
  opts?: FetchOpts
): Promise<ApiResponse<TData>> {
  const headers: HeadersInit = { ...JSON_HEADERS }
  if (opts?.token) {
    ;(headers as Record<string, string>)["Authorization"] = `Bearer ${opts.token}`
  }
  const res = await fetch(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    credentials: "include",
  })
  return res.json() as Promise<ApiResponse<TData>>
}

/**
 * GET and parse API envelope (optional Bearer).
 */
export async function apiGet<TData>(
  path: string,
  opts?: FetchOpts
): Promise<ApiResponse<TData>> {
  const headers: HeadersInit = {}
  if (opts?.token) {
    ;(headers as Record<string, string>)["Authorization"] = `Bearer ${opts.token}`
  }
  const res = await fetch(path, {
    method: "GET",
    headers,
    credentials: "include",
  })
  return res.json() as Promise<ApiResponse<TData>>
}

/**
 * PUT JSON and parse API envelope.
 */
export async function apiPut<TData, TBody extends object = Record<string, unknown>>(
  path: string,
  body: TBody,
  opts?: FetchOpts
): Promise<ApiResponse<TData>> {
  const headers: HeadersInit = { ...JSON_HEADERS }
  if (opts?.token) {
    ;(headers as Record<string, string>)["Authorization"] = `Bearer ${opts.token}`
  }
  const res = await fetch(path, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
    credentials: "include",
  })
  return res.json() as Promise<ApiResponse<TData>>
}

/**
 * PATCH JSON and parse API envelope.
 */
export async function apiPatch<TData, TBody extends object = Record<string, unknown>>(
  path: string,
  body: TBody,
  opts?: FetchOpts
): Promise<ApiResponse<TData>> {
  const headers: HeadersInit = { ...JSON_HEADERS }
  if (opts?.token) {
    ;(headers as Record<string, string>)["Authorization"] = `Bearer ${opts.token}`
  }
  const res = await fetch(path, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
    credentials: "include",
  })
  return res.json() as Promise<ApiResponse<TData>>
}

/**
 * DELETE and parse API envelope.
 */
export async function apiDelete<TData>(
  path: string,
  opts?: FetchOpts
): Promise<ApiResponse<TData>> {
  const headers: HeadersInit = {}
  if (opts?.token) {
    ;(headers as Record<string, string>)["Authorization"] = `Bearer ${opts.token}`
  }
  const res = await fetch(path, {
    method: "DELETE",
    headers,
    credentials: "include",
  })
  return res.json() as Promise<ApiResponse<TData>>
}
