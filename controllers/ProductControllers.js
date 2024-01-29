import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import Product from "../models/Product";
import Comment from "../models/Comment";
import { fileRemover } from "../utils/prodRemover";
import { stringify, v4 as uuidv4 } from "uuid";

const createProduct = async (req, res, next) => {
    try {
        const product = new Product({
            title: "sample title",
            descriptions: "sample descriptions",
            slug: uuidv4(),
            user: req.user._id,
            photo: [],
        });

        const createdProduct = await product.save();
        return res.json(createdProduct);
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });

        if (!product) {
            const error = new Error("Product aws not found");
            next(error);
            return;
        }

        const upload = uploadPicture.array("postPicture", 5);

        const handleUpdateProduct = async (data) => {
            const { title, description, slug, tags, categories } = JSON.parse(data);
            product.title = title || product.title;
            product.descriptions = description || product.descriptions;
            product.slug = slug || product.slug;
            product.tags = tags || product.tags;
            product.categories = categories || product.categories;
            if (Array.isArray(req.files) && req.files.length > 0) {
                // Remove existing files before updating if there are new files
                await fileRemover(product.photo);
                product.photo = req.files.map((file) => file.filename);
              }

            const updatedProduct = await product.save();
            return res.json(updatedProduct);
        }
        upload(req, res, async function (err) {
            if (err) {
              const error = new Error("An unknown error occurred when uploading " + err.message);
              next(error);
            } else {
              if (req.file) {
                await fileRemover(product.photo);
                product.photo = req.file.filename;
                handleUpdateProduct(req.body.document);
              } else {
                // No new file uploaded, proceed with the update
                handleUpdateProduct(req.body.document);
              }
            }
          });
        } catch (error) {
          next(error);
        }
};


const deleteProduct = async (req, res, next) => {
    try{
        const product = await Product.findOne({ slug: req.params.slug });

        if (!product) {
            const error = new Error("Product aws not found");
            next(error);
            return next(error);
        }

        await product.remove();
    }
    catch(error){
        next(error);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).populate([
            {
                path: "user",
                select: ["avatar", "name", "verified"],
            },
            {
                path: "categories",
                select: ["title"],
            },
        ]);

        if (!product) {
            const error = new Error("Product not found");
            next(error);
            return;
        }

        return res.json(product);
    } catch (error) {
        next(error);
    }
};

const getAllProducts = async (req, res, next) => {
    // try {
    //     const products = await Product.find();

    //     return res.json(products);
    // } catch (error) {
    //     next(error);
    // }
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if (filter) {
          where.title = { $regex: filter, $options: "i" };
        }
        let query = Product.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await Product.find(where).countDocuments();
        const pages = Math.ceil(total / pageSize);
    
        res.header({
          "x-filter": filter,
          "x-totalcount": JSON.stringify(total),
          "x-currentpage": JSON.stringify(page),
          "x-pagesize": JSON.stringify(pageSize),
          "x-totalpagecount": JSON.stringify(pages),
        });
    
        if (page > pages) {
          return res.json([]);
        }
    
        const result = await query
          .skip(skip)
          .limit(pageSize)
          .populate([
            {
              path: "user",
              select: ["avatar", "name", "verified"],
            },
            {
              path: "categories",
              select: ["title"],
            },
          ])
          .sort({ updatedAt: "desc" });
    
        return res.json(result);
      } catch (error) {
        next(error);
      }
};

export { createProduct, updateProduct, deleteProduct, getProduct, getAllProducts }