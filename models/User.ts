import type { InferSchemaType } from "mongoose"
import mongoose, { Schema } from "mongoose"

const locationSchema = new Schema(
  {
    city: { type: String },
    state: { type: String },
    country: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { _id: false }
)

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String },
    avatar: { type: String },
    location: { type: locationSchema },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    refreshTokens: [{ type: String }],
    // Password reset — selected explicitly only when needed
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
)

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId
}

export const User =
  mongoose.models.User ?? mongoose.model("User", userSchema)
