import type { InferSchemaType } from "mongoose"
import mongoose, { Schema } from "mongoose"

const favoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
  },
  { timestamps: true }
)

favoriteSchema.index({ user: 1, listing: 1 }, { unique: true })

export type FavoriteDocument = InferSchemaType<typeof favoriteSchema> & {
  _id: mongoose.Types.ObjectId
}

export const Favorite =
  mongoose.models.Favorite ?? mongoose.model("Favorite", favoriteSchema)
