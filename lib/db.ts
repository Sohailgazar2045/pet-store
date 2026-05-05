import mongoose from "mongoose"

// Ensure models are registered
import "@/models/User"
import "@/models/Listing"
import "@/models/Favorite"
import "@/models/Conversation"
import "@/models/Message"
import "@/models/Report"

/**
 * Reuses a single MongoDB connection across Next.js hot reloads in development.
 */
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI && process.env.NODE_ENV !== "test") {
  console.warn(
    "[db] MONGODB_URI is not set. API routes that need the database will fail until it is configured."
  )
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalForMongoose = globalThis as unknown as {
  mongooseCache?: MongooseCache
}

const cache: MongooseCache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
}

if (process.env.NODE_ENV !== "production") {
  globalForMongoose.mongooseCache = cache
}

/**
 * Connects to MongoDB using Mongoose and returns the mongoose instance.
 * @throws If `MONGODB_URI` is missing or connection fails
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    )
  }

  if (cache.conn) {
    return cache.conn
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI).then((m) => m)
  }

  try {
    cache.conn = await cache.promise
  } catch (e) {
    cache.promise = null
    throw e
  }

  return cache.conn
}
