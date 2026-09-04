// const express = require("express");
// const router = express.Router();
// const {
//   sendInquiry,
//   getPropertyInquiries,
// } = require("../controllers/inquiryController");
// const verifyToken = require("../middleware/authMiddleware");
// const jwt = require("jsonwebtoken");

// // Optional Auth Middleware for guest inquiries support
// const optionalAuth = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return next();

//   jwt.verify(
//     token,
//     process.env.JWT_SECRET || "your_secret_key",
//     (err, user) => {
//       if (!err) {
//         req.user = user;
//       }
//       next();
//     },
//   );
// };

// // POST route uses optionalAuth so guests can also submit inquiries
// router.post("/", optionalAuth, sendInquiry);

// // GET route requires strict token verification for owners
// router.get("/my-inquiries", verifyToken, getPropertyInquiries);

// module.exports = router;

// Swagger API

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

/**
 * @swagger
 * /api/inquiries:
 *   post:
 *     summary: Send a property inquiry
 *     description: Guests can also send inquiries without authentication.
 *     tags:
 *       - Inquiries
 *     security:
 *       - BearerAuth: []
 *       - {}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Santhosh
 *               email:
 *                 type: string
 *                 format: email
 *                 example: santhosh@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               message:
 *                 type: string
 *                 example: I am interested in this property.
 *     responses:
 *       201:
 *         description: Inquiry sent successfully
 *       400:
 *         description: Invalid inquiry data
 */
router.post("/", optionalAuth, sendInquiry);

/**
 * @swagger
 * /api/inquiries/my-inquiries:
 *   get:
 *     summary: Get inquiries for user's properties
 *     tags:
 *       - Inquiries
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Inquiries retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/my-inquiries", verifyToken, getPropertyInquiries);

module.exports = router;