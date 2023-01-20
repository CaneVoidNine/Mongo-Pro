import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewsSchema = new Schema({
  comment: { type: String, required: true },
  rate: { type: Number, required: true },
});

export default model("Reviews", reviewsSchema);
