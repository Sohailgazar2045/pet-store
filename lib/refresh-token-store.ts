import type { Types } from "mongoose"
import { User } from "@/models/User"

const MAX_HASHES = 10

/**
 * Appends a refresh token hash to the user, keeping only the most recent entries.
 */
export async function storeRefreshTokenHash(
  userId: Types.ObjectId,
  hash: string
): Promise<void> {
  const user = await User.findById(userId)
  if (!user) return
  const list = [...(user.refreshTokens ?? []), hash]
  user.refreshTokens = list.slice(-MAX_HASHES)
  await user.save()
}

/**
 * Removes a refresh token hash (logout or rotation).
 */
export async function removeRefreshTokenHash(
  userId: Types.ObjectId,
  hash: string
): Promise<boolean> {
  const result = await User.updateOne(
    { _id: userId },
    { $pull: { refreshTokens: hash } }
  )
  return result.modifiedCount > 0
}

/**
 * Returns true if the user currently has this refresh hash stored.
 */
export async function hasRefreshTokenHash(
  userId: Types.ObjectId,
  hash: string
): Promise<boolean> {
  const n = await User.countDocuments({
    _id: userId,
    refreshTokens: hash,
  })
  return n > 0
}
