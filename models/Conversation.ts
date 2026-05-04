import type { InferSchemaType } from "mongoose"
import mongoose, { Schema } from "mongoose"

const unreadCountSchema = new Schema(
  {
    buyer: { type: Number, default: 0 },
    seller: { type: Number, default: 0 },
  },
  { _id: false }
)

const conversationSchema = new Schema(
  {
    listing: { type: Schema.Types.ObjectId, ref: "Listing" },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    unreadCount: { type: unreadCountSchema, default: () => ({ buyer: 0, seller: 0 }) },
  },
  { timestamps: true }
)

conversationSchema.index({ participants: 1 })
conversationSchema.index({ listing: 1 })

export type ConversationDocument = InferSchemaType<
  typeof conversationSchema
> & {
  _id: mongoose.Types.ObjectId
}

export const Conversation =
  mongoose.models.Conversation ??
  mongoose.model("Conversation", conversationSchema)
