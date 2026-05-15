import { connectDB } from "@/lib/db"
import { Conversation } from "@/models/Conversation"
import { getAccessPayloadOrError } from "@/lib/request-auth"
import { successJson, errorJson } from "@/lib/api-response"

export async function POST(req: Request) {
  const payload = getAccessPayloadOrError(req)
  if (payload instanceof Response) return payload

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorJson("Invalid JSON body", 400, "INVALID_JSON")
  }

  const { listingId, sellerId } = body as Record<string, unknown>

  if (!listingId || typeof listingId !== "string") {
    return errorJson("listingId is required", 400, "MISSING_FIELD")
  }
  if (!sellerId || typeof sellerId !== "string") {
    return errorJson("sellerId is required", 400, "MISSING_FIELD")
  }
  if (sellerId === payload.sub) {
    return errorJson("Cannot start a conversation with yourself", 400, "SELF_CONVERSATION")
  }

  try {
    await connectDB()
  } catch (e) {
    console.error("[conversations/POST] DB error", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  let conversation = await Conversation.findOne({
    listing: listingId,
    participants: { $all: [payload.sub, sellerId] },
  })

  if (!conversation) {
    // participants[0] = buyer (initiator), participants[1] = seller
    conversation = await Conversation.create({
      listing: listingId,
      participants: [payload.sub, sellerId],
      unreadCount: { buyer: 0, seller: 0 },
    })
  }

  return successJson(conversation, 200)
}

export async function GET(req: Request) {
  const payload = getAccessPayloadOrError(req)
  if (payload instanceof Response) return payload

  try {
    await connectDB()
  } catch (e) {
    console.error("[conversations/GET] DB error", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  const conversations = await Conversation.find({
    participants: payload.sub,
  })
    .populate("participants", "name avatar")
    .populate("listing", "title price images")
    .populate("lastMessage")
    .sort({ updatedAt: -1 })

  return successJson(conversations)
}
