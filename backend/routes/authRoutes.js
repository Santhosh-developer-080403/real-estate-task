// const express = require("express");
// const router = express.Router();
// const {
//   register,
//   login,
//   getUserProfile,
//   updateProfile,
// } = require("../controllers/authController");
// const verifyToken = require("../middleware/authMiddleware");

// router.post("/register", register);
// router.post("/login", login);
// router.get("/profile", verifyToken, getUserProfile);
// router.put("/profile", verifyToken, updateProfile);

// module.exports = router;

// Correct AuthRoutes

// const express = require("express");
// const router = express.Router();
// const {
//   register,
//   login,
//   getUserProfile,
//   updateProfile,
// } = require("../controllers/authController");
// const verifyToken = require("../middleware/authMiddleware");

// router.post("/register", register);
// router.post("/login", login);
// router.get("/profile", verifyToken, getUserProfile);
// router.put("/profile", verifyToken, updateProfile);

// module.exports = router;

// Swagger Api

const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getUserProfile,
  updateProfile,
} = require("../controllers/authController");

const verifyToken = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Santhosh
 *               email:
 *                 type: string
 *                 format: email
 *                 example: santhosh@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request or user already exists
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: santhosh@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", verifyToken, getUserProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update logged-in user profile
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Santhosh Kumar
 *               email:
 *                 type: string
 *                 format: email
 *                 example: santhosh@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", verifyToken, updateProfile);

module.exports = router;