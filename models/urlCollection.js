import { Schema, model } from "mongoose";

const shortenUrlSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
});

export default model("ShortenUrl", shortenUrlSchema);
