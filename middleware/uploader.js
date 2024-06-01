const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: (req) => {
    const customerFolder = "account"; // Set default value if folder field is not present
    return {
      folder: customerFolder,
    };
  },
});

const upload = multer({ storage });

// Separate uploader middleware
const uploader = (req, res, next) => {
  const fileData = req.file;
  if (!fileData) {
    req.file = "...";
  }
  next();
};

module.exports = { upload, uploader };
