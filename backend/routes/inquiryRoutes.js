const express = require("express");
const router = express.Router();
const {
  sendInquiry,
  getPropertyInquiries,
} = require("../controllers/inquiryController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, sendInquiry);
router.get("/my-inquiries", verifyToken, getPropertyInquiries);

module.exports = router;
