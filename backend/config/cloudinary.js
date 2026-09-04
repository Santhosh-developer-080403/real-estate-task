const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary configured");
console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Uploader available:", !!cloudinary.uploader);
console.log(
  "Upload stream available:",
  typeof cloudinary.uploader?.upload_stream,
);

module.exports = cloudinary;
