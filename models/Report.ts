import type { InferSchemaType } from "mongoose"
import mongoose, { Schema } from "mongoose"

const reportSchema = new Schema(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    reason: {
      type: String,
      enum: ["spam", "fraud", "inappropriate", "wrong_category", "other"],
      required: true,
    },
    description: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
)

reportSchema.index({ reporter: 1, listing: 1 })
reportSchema.index({ status: 1 })

export type ReportDocument = InferSchemaType<typeof reportSchema> & {
  _id: mongoose.Types.ObjectId
}

export const Report =
  mongoose.models.Report ?? mongoose.model("Report", reportSchema)
