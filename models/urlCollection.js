import { Schema, model } from "mongoose";

//   accountId: {
//     type: Schema.Types.ObjectId,
//     ref: "Account",
//   },

const shortenUrlSchema = new Schema({
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
