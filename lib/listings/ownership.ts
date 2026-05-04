import type { UserRole } from "@/types"

/**
 * Owner may edit/delete their listing; admins may act on any listing.
 */
export function canManageListing(
  sellerId: unknown,
  userId: string,
  role: UserRole
): boolean {
  if (role === "admin") return true
  if (sellerId == null) return false
  return String(sellerId) === userId
}
