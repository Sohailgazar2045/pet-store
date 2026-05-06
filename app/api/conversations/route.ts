import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Conversation } from "@/models/Conversation"
import { getAccessPayloadOrError } from "@/lib/request-auth"

export async function POST(req: Request) {
  try {
    const payload = getAccessPayloadOrError(req)
    if (payload instanceof Response) return payload

    const { listingId, sellerId } = await req.json()

    if (!listingId || !sellerId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    await connectDB()

    let conversation = await Conversation.findOne({
      listing: listingId,
      participants: { $all: [payload.sub, sellerId] },
    })

    if (!conversation) {
      conversation = await Conversation.create({
        listing: listingId,
        participants: [payload.sub, sellerId],
        unreadCount: { buyer: 0, seller: 0 },
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
    const payload = getAccessPayloadOrError(req)
    if (payload instanceof Response) return payload

    await connectDB()

    const conversations = await Conversation.find({
      participants: payload.sub,
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
