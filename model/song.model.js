import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: String,
    audioUrl: String,
    imageUrl: String,

    duration: {
      type: Number,
    },

    artistSlug: {
      type: String,
      required: true,
      index: true
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },

    likes: { type: Number, default: 0 },
    plays: { type: Number, default: 0 },
  },

  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);

export default Song;