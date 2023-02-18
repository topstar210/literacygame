import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    quesInd: Number,
    gamepine: String,
    groupInd: Number,
    username: String,
    answer: String,
    votes: { type: Number, default: 0 },
    points: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    collection: "answers",
  }
);

export default mongoose.model("Answer", answerSchema);