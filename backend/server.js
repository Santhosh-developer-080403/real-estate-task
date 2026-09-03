const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const swaggerDocs = require("./config/swagger");
const app = express();
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
swaggerDocs(app);

app.get("/", (req, res) => {
  res.json({ message: "Real Estate Backend API is running successfully!" });
});

const PORT = process.env.API_URL;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
