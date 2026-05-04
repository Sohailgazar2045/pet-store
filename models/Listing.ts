import type { InferSchemaType } from "mongoose"
import mongoose, { Schema } from "mongoose"

const imageSchema = new Schema(
  {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
)

const ageSchema = new Schema(
  {
    value: { type: Number },
    unit: { type: String, enum: ["days", "months", "years"] },
  },
  { _id: false }
)

const listingLocationSchema = new Schema(
  {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: "Pakistan" },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { _id: false }
)

const listingSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: ["cattle", "pets"] },
    subcategory: {
      type: String,
      required: true,
      enum: [
        "cow",
        "bull",
        "calf",
        "goat",
        "sheep",
        "horse",
        "dog",
        "cat",
        "bird",
        "rabbit",
        "fish",
        "other",
      ],
    },
    breed: { type: String },
    age: { type: ageSchema },
    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
    },
    images: [imageSchema],
    location: { type: listingLocationSchema, required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["active", "sold", "pending", "rejected"],
      default: "pending",
    },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
)

listingSchema.index({ category: 1 })
listingSchema.index({ subcategory: 1 })
listingSchema.index({ "location.city": 1 })
listingSchema.index({ price: 1 })
listingSchema.index({ status: 1 })
listingSchema.index({ seller: 1 })
listingSchema.index({ title: "text", description: "text", breed: "text" })

export type ListingDocument = InferSchemaType<typeof listingSchema> & {
  _id: mongoose.Types.ObjectId
}

export const Listing =
  mongoose.models.Listing ?? mongoose.model("Listing", listingSchema)
