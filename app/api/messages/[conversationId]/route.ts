import { connectDB } from "@/lib/db"
import { Message } from "@/models/Message"
import { Conversation } from "@/models/Conversation"
import { getAccessPayloadOrError } from "@/lib/request-auth"
import { successJson, errorJson } from "@/lib/api-response"
import DOMPurify from "isomorphic-dompurify"

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  const payload = getAccessPayloadOrError(req)
  if (payload instanceof Response) return payload

  try {
    await connectDB()
  } catch (e) {
    console.error("[messages/GET] DB error", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  // Verify caller is a participant
  const conversation = await Conversation.findById(params.conversationId)
  if (!conversation) {
    return errorJson("Conversation not found", 404, "NOT_FOUND")
  }

  const participantIds = conversation.participants.map((p: unknown) => String(p))
  if (!participantIds.includes(payload.sub)) {
    return errorJson("Forbidden", 403, "FORBIDDEN")
  }

  const messages = await Message.find({
    conversation: params.conversationId,
  }).sort({ createdAt: 1 })

  // Mark incoming messages as read and reset the caller's unread counter
  await Message.updateMany(
    {
      conversation: params.conversationId,
      sender: { $ne: payload.sub },
      isRead: false,
    },
    { $set: { isRead: true } }
  )

  // Reset unread count for the current user
  const isBuyer = participantIds[0] === payload.sub
  const unreadField = isBuyer ? "unreadCount.buyer" : "unreadCount.seller"
  await Conversation.findByIdAndUpdate(params.conversationId, {
    $set: { [unreadField]: 0 },
  })

  return successJson(messages)
}

export async function POST(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  const payload = getAccessPayloadOrError(req)
  if (payload instanceof Response) return payload

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorJson("Invalid JSON body", 400, "INVALID_JSON")
  }

  const { content } = body as Record<string, unknown>

  if (!content || typeof content !== "string" || !content.trim()) {
    return errorJson("Message content is required", 400, "MISSING_FIELD")
  }

  const sanitized = DOMPurify.sanitize(content.trim(), { ALLOWED_TAGS: [] })
  if (!sanitized) {
    return errorJson("Message content is invalid", 400, "INVALID_CONTENT")
  }
  if (sanitized.length > 1000) {
    return errorJson("Message must be 1000 characters or fewer", 400, "TOO_LONG")
  }

  try {
    await connectDB()
  } catch (e) {
    console.error("[messages/POST] DB error", e)
    return errorJson("Database unavailable", 503, "DB_ERROR")
  }

  // Verify caller is a participant
  const conversation = await Conversation.findById(params.conversationId)
  if (!conversation) {
    return errorJson("Conversation not found", 404, "NOT_FOUND")
  }

  const participantIds = conversation.participants.map((p: unknown) => String(p))
  if (!participantIds.includes(payload.sub)) {
    return errorJson("Forbidden", 403, "FORBIDDEN")
  }

  const message = await Message.create({
    conversation: params.conversationId,
    sender: payload.sub,
    content: sanitized,
  })

  // Increment the OTHER participant's unread count
  const isBuyer = participantIds[0] === payload.sub
  const unreadField = isBuyer ? "unreadCount.seller" : "unreadCount.buyer"

  await Conversation.findByIdAndUpdate(params.conversationId, {
    lastMessage: message._id,
    $inc: { [unreadField]: 1 },
    updatedAt: new Date(),
  })

  return successJson(message, 201)
}
