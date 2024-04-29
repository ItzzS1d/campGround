const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "campGroundPhotos",
    allowerdFormats: ["png", "jpg", "jpeg"],
  },
});

module.exports = { storage, cloudinary };
