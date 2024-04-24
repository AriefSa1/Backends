import { Schema, model } from "mongoose";

const PostCategoriesSchema = new Schema(
  {
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const PostCategories = model("PostCategories", PostCategoriesSchema);
export default PostCategories;
