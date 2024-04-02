import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: false },
    descriptions: { type: String, required: false },
    slug: { type: String, required: false, unique: true },
    photo: { type: [String] },
    materials: [
      {
        name: String,
        description: String
      }
    ],
    user: { type: Schema.Types.ObjectId, ref: "User" },
    categories: [{ type: Schema.Types.ObjectId, ref: "PostCategories" }],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);


// ProductSchema.virtual("comments", {
//   ref: "Comment",
//   localField: "_id",
//   foreignField: "products",
// });

const Product = model("Products", ProductSchema);
export default Product;
