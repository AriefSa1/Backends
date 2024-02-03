import multer from "multer";

const storage = multer.memoryStorage();

const uploadPicture = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
    console.log(file)
  },
});

export { uploadPicture };
