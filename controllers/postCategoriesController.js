import PostCategories from "../models/PostCategories";
import Post from "../models/Post";

const createPostCategory = async (req, res, next) => {
  try {
    const { category } = req.body;
    const postCategory = await PostCategories.findOne({ category });

    if (postCategory) {
      const error = new Error("Category is already created!");
      return next(error);
    }

    const newPostCategory = new PostCategories({
      category,
    });

    const savedPostCategory = await newPostCategory.save();

    return res.status(201).json(savedPostCategory);
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const postCategory = await PostCategories.findById(req.params.postCategoryId);

    if (!postCategory) {
      const error = new Error("Category was not found");
      return next(error);
    }

    return res.json(postCategory);
  } catch (error) {
    next(error);
  }
};

const getAllPostCategories = async (req, res, next) => {
  try {
    const postCategories = await PostCategories.find({});

    return res.json(postCategories);
  } catch (error) {
    next(error);
  }
};

const updatePostCategory = async (req, res, next) => {
  try {
    const { category } = req.body;

    const postCategory = await PostCategories.findByIdAndUpdate(
      req.params.postCategoryId,
      {
        category,
      },
      {
        new: true,
      }
    );

    if (!postCategory) {
      const error = new Error("Category was not found");
      return next(error);
    }

    return res.json(postCategory);
  } catch (error) {
    next(error);
  }
};

const deletePostCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.postCategoryId;

    await Post.updateMany(
      { categories: { $in: [categoryId] } },
      { $pull: { categories: categoryId } }
    );

    await PostCategories.deleteOne({ _id: categoryId });

    res.send({
      message: "Post category is successfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createPostCategory,
  getAllPostCategories,
  updatePostCategory,
  deletePostCategory,
  getCategory,
};
