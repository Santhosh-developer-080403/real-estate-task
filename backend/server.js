const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { pool } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const swaggerDocs = require("./config/swagger");

const path = require("path");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/properties", propertyRoutes);

app.use("/api/inquiries", inquiryRoutes);

// ==========================================
// STATIC FILES
// ==========================================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================================
// SWAGGER
// ==========================================

swaggerDocs(app);

// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Real Estate Backend API is running successfully!",
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// IMPORTANT:
// This must be AFTER all routes
// ==========================================

app.use((err, req, res, next) => {
  console.error("\n");
  console.error("==========================================");
  console.error("        GLOBAL SERVER ERROR");
  console.error("==========================================");

  console.error("Error:", err);
  console.error("Error message:", err?.message);
  console.error("Error name:", err?.name);
  console.error("Error status:", err?.status);
  console.error("Error statusCode:", err?.statusCode);
  console.error("Error stack:", err?.stack);

  if (err?.error) {
    console.error("Nested error:", err.error);
  }

  console.error("==========================================");
  console.error("\n");

  // If response was already sent
  if (res.headersSent) {
    return next(err);
  }

  // Always return JSON
  return res.status(err?.status || err?.statusCode || 500).json({
    success: false,

    message: err?.message || "Internal server error",

    error: err?.error || null,

    details:
      typeof err === "object"
        ? {
            name: err?.name || null,
            code: err?.code || null,
            http_code: err?.http_code || null,
          }
        : String(err),
  });
});

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("==========================================");
  console.log(`Server is running on port ${PORT}`);
  console.log("==========================================");
});
