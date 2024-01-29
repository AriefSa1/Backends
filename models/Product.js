import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: false },
    descriptions: { type: String, required: false },
    slug: { type: String, required: false, unique: true },
    photo: { type: [String] },
    tags: { type: [String] },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    categories: [{ type: Schema.Types.ObjectId, ref: "PostCategories" }],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const Product = model("Products", ProductSchema);
export default Product;
