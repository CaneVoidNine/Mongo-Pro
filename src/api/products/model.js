import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    brand: { type: String, required: false },
    imageUrl: { type: String, required: false },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    review: [{ type: Schema.Types.ObjectId, ref: "Reviews" }],
  },

  {
    timestamps: true,
  }
);

export default model("Products", productsSchema);
