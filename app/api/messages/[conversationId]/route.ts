import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Message } from "@/models/Message"
import { Conversation } from "@/models/Conversation"
import { getAccessPayloadOrError } from "@/lib/request-auth"

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const payload = getAccessPayloadOrError(req)
    if (payload instanceof Response) return payload

    await connectDB()

    const messages = await Message.find({
      conversation: params.conversationId,
    }).sort({ createdAt: 1 })

    await Message.updateMany(
      {
        conversation: params.conversationId,
        sender: { $ne: payload.sub },
        isRead: false,
      },
      { $set: { isRead: true } }
    )

    return NextResponse.json(messages)
  } catch (error) {
    console.error("MESSAGES_GET_ERROR", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const payload = getAccessPayloadOrError(req)
    if (payload instanceof Response) return payload

    const { content } = await req.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    await connectDB()

    const message = await Message.create({
      conversation: params.conversationId,
      sender: payload.sub,
      content: content.trim(),
    })

    await Conversation.findByIdAndUpdate(params.conversationId, {
      lastMessage: message._id,
      $inc: { "unreadCount.seller": 1 },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("MESSAGES_POST_ERROR", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
