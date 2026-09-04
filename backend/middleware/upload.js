const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const multerUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    files: 5,
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"));
    }

    cb(null, true);
  },
});

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    if (!cloudinary) {
      return reject(new Error("Cloudinary is not initialized"));
    }

    if (!cloudinary.uploader) {
      return reject(new Error("Cloudinary uploader is not available"));
    }

    if (typeof cloudinary.uploader.upload_stream !== "function") {
      return reject(new Error("Cloudinary upload_stream is not available"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "property-images",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("CLOUDINARY CALLBACK ERROR:", error);
          return reject(error);
        }

        console.log("CLOUDINARY SUCCESS:", result?.secure_url);

        resolve(result);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

const upload = (req, res, next) => {
  multerUpload.array("images", 5)(req, res, async (err) => {
    if (err) {
      console.error("========== MULTER ERROR ==========");
      console.error(err);
      console.error("==================================");

      return res.status(400).json({
        success: false,
        message: err.message || "Image upload error",
      });
    }

    try {
      console.log("========== IMAGE UPLOAD ==========");
      console.log("Files received:", req.files?.length || 0);

      if (!req.files || req.files.length === 0) {
        console.log("No images uploaded");
        req.files = [];
        return next();
      }

      const uploadedFiles = [];

      for (const file of req.files) {
        console.log("----------------------------------");
        console.log("Original name:", file.originalname);
        console.log("Mimetype:", file.mimetype);
        console.log("Size:", file.size);

        const result = await uploadToCloudinary(file.buffer);

        if (!result || !result.secure_url) {
          throw new Error("Cloudinary did not return a secure URL");
        }

        uploadedFiles.push({
          path: result.secure_url,
          filename: result.public_id,
          originalname: file.originalname,
          mimetype: file.mimetype,
        });

        console.log("Uploaded URL:", result.secure_url);
      }

      req.files = uploadedFiles;

      console.log("Total uploaded:", uploadedFiles.length);
      console.log("==================================");

      next();
    } catch (error) {
      console.error("========== CLOUDINARY ERROR ==========");
      console.error("Error:", error);
      console.error("Message:", error?.message);
      console.error("Name:", error?.name);
      console.error("HTTP code:", error?.http_code);
      console.error("======================================");

      return res.status(500).json({
        success: false,
        message: "Cloudinary image upload failed",
        error: error?.message || String(error),
        cloudinary_error: error?.error || null,
      });
    }
  });
};

module.exports = upload;
