// const express = require("express");
// const router = express.Router();
// const {
//   getProperties,
//   getPropertyById,
//   getMyProperties,
//   createProperty,
//   updateProperty,
//   deleteProperty,
// } = require("../controllers/propertyController");
// const authMiddleware = require("../middleware/authMiddleware");
// const upload = require("../middleware/upload");

// router.get("/", getProperties);
// router.get("/my-properties", authMiddleware, getMyProperties); // MUST be before /:id
// router.get("/:id", getPropertyById);
// router.post("/", authMiddleware, upload.array("images", 5), createProperty);
// router.put("/:id", authMiddleware, upload.array("images", 5), updateProperty);
// router.delete("/:id", authMiddleware, deleteProperty);

// module.exports = router;

// Swagger API

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

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties
 *     tags:
 *       - Properties
 *     responses:
 *       200:
 *         description: Properties retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", getProperties);

/**
 * @swagger
 * /api/properties/my-properties:
 *   get:
 *     summary: Get properties created by the logged-in user
 *     tags:
 *       - Properties
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User properties retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/my-properties", authMiddleware, getMyProperties);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get a property by ID
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 1
 *     responses:
 *       200:
 *         description: Property retrieved successfully
 *       404:
 *         description: Property not found
 */
router.get("/:id", getPropertyById);

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property
 *     tags:
 *       - Properties
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Invalid property data
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, upload.array("images", 5), createProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update an existing property
 *     tags:
 *       - Properties
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */
router.put("/:id", authMiddleware, upload.array("images", 5), updateProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete a property
 *     tags:
 *       - Properties
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 1
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */
router.delete("/:id", authMiddleware, deleteProperty);

module.exports = router;