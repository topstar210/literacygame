import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    quesInd: Number,
    gamepine: String,
    groupInd: Number,
    username: String,
    answer: String,
    votes: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    finalsVotes: { type: Number, default: 0 },
    finalsPoints: { type: Number, default: 0 },
    extraPoints: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "answers",
  }
);

export default mongoose.model("Answer", answerSchema);