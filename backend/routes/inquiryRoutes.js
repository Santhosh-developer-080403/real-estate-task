const express = require("express");
const router = express.Router();
const {
  sendInquiry,
  getPropertyInquiries,
} = require("../controllers/inquiryController");
const verifyToken = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

// Optional Auth Middleware for guest inquiries support
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return next();

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_secret_key",
    (err, user) => {
      if (!err) {
        req.user = user;
      }
      next();
    },
  );
};

// POST route uses optionalAuth so guests can also submit inquiries
router.post("/", optionalAuth, sendInquiry);

// GET route requires strict token verification for owners
router.get("/my-inquiries", verifyToken, getPropertyInquiries);

module.exports = router;
