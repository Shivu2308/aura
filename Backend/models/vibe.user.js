import mongoose from "mongoose";

const vibeSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    mediaId: {
       type: String 
      },
    caption: {
      type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
    comments: [{
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",},
        message: {
          type: String,
        },
      },],
  },
  { timestamps: true }
);

const Vibe = mongoose.model("Vibe", vibeSchema);

export default Vibe;
