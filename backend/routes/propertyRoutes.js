const express = require("express");
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/", getProperties);
router.get("/my-properties", authMiddleware, getMyProperties); // MUST be before /:id
router.get("/:id", getPropertyById);
router.post("/", authMiddleware, upload.array("images", 5), createProperty);
router.put("/:id", authMiddleware, upload.array("images", 5), updateProperty);
router.delete("/:id", authMiddleware, deleteProperty);

module.exports = router;
