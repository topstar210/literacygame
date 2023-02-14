import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    gameName: String,
    pineCode: String,
    questions: Array,
    settings: Object,
    creater: String
  },
  {
    timestamps: true,
    collection: "game",
  }
);

export default mongoose.model("Game", gameSchema);