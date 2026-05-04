import type { InferSchemaType } from "mongoose"
import mongoose, { Schema } from "mongoose"

const messageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 1000 },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

messageSchema.index({ conversation: 1, createdAt: 1 })

export type MessageDocument = InferSchemaType<typeof messageSchema> & {
  _id: mongoose.Types.ObjectId
}

export const Message =
  mongoose.models.Message ?? mongoose.model("Message", messageSchema)
