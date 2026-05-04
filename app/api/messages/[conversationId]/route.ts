import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Message } from "@/models/Message"
import { Conversation } from "@/models/Conversation"
import { verifyAuth } from "@/lib/auth/jwt"

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const messages = await Message.find({
      conversation: params.conversationId
    })
    .sort({ createdAt: 1 })

    // Mark as read
    await Message.updateMany(
      { conversation: params.conversationId, sender: { $ne: user.id }, isRead: false },
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
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    await connectDB()

    const message = await Message.create({
      conversation: params.conversationId,
      sender: user.id,
      content
    })

    // Update last message in conversation
    await Conversation.findByIdAndUpdate(params.conversationId, {
      lastMessage: message._id,
      $inc: { "unreadCount.seller": 1 } // Simplified logic for demo
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("MESSAGES_POST_ERROR", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
