const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  // allowedFormats: ["jpg", "png"],
  allowedFormats: ["mp3"],
  params: (req) => {
    return {
      folder: "Music",
      resource_type: "video", // Specify resource type as raw for non-image files
    };
  },
});

const uploadCloud = multer({ storage }).fields([{ name: "mp3", maxCount: 1 }]);
module.exports = uploadCloud;
