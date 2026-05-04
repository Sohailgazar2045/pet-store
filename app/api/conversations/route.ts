import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Conversation } from "@/models/Conversation"
import { verifyAuth } from "@/lib/auth/jwt"

export async function POST(req: Request) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { listingId, sellerId } = await req.json()

    if (!listingId || !sellerId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    await connectDB()

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      listing: listingId,
      participants: { $all: [user.id, sellerId] }
    })

    if (!conversation) {
      conversation = await Conversation.create({
        listing: listingId,
        participants: [user.id, sellerId],
        unreadCount: { buyer: 0, seller: 0 }
      })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("CONVERSATION_POST_ERROR", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const conversations = await Conversation.find({
      participants: user.id
    })
    .populate("participants", "name avatar")
    .populate("listing", "title price images coverUrl")
    .populate("lastMessage")
    .sort({ updatedAt: -1 })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("CONVERSATION_GET_ERROR", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
