const cloudinary = require("cloudinary").v2;
const Customer = require("../model/user"); // Assuming customer model is defined in models/customer.js

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Middleware to delete image from Cloudinary
const deleteImageFromCloudinary = async (req, res, next) => {
  try {
    const { _id } = req.body; // Assuming the id is passed as '_id'
    const customer = await Customer.findById(_id);
    if (customer && customer.account_image) {
      // Extract the filename from the image URL
      const filename = customer.account_image.split("/").pop();
      // Extract the folder name from the image URL
      const folder = customer.account_image.match(/\/([^/]+)\/[^/]+$/)[1];
      // Construct the public_id with the folder and filename
      const publicId = `${folder}/${filename.split(".")[0]}`;
      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(publicId);
    }
    next();
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting image from Cloudinary",
    });
  }
};

module.exports = {
  deleteImageFromCloudinary, // Exporting middleware
};
