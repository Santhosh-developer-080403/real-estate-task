// const pool = require("../config/db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // Register Controller
// const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const userExists = await pool.query(
//       "SELECT * FROM users WHERE email = $1",
//       [email],
//     );
//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ error: "Email already registered." });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = await pool.query(
//       "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
//       [name, email, hashedPassword],
//     );

//     res.status(201).json({
//       message: "User registered successfully!",
//       user: newUser.rows[0],
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Login Controller
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await pool.query("SELECT * FROM users WHERE email = $1", [
//       email,
//     ]);
//     if (user.rows.length === 0) {
//       return res.status(400).json({ error: "Invalid email or password." });
//     }

//     const validPassword = await bcrypt.compare(password, user.rows[0].password);
//     if (!validPassword) {
//       return res.status(400).json({ error: "Invalid email or password." });
//     }

//     const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.json({
//       message: "Login successful!",
//       token,
//       user: {
//         id: user.rows[0].id,
//         name: user.rows[0].name,
//         email: user.rows[0].email,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get User Profile Controller
// const getUserProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const user = await pool.query(
//       "SELECT id, name, email, phone, bio, address, role FROM users WHERE id = $1",
//       [userId],
//     );

//     if (user.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update User Profile Controller (Fixed SQL parameters index)
// const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { name, phone, bio, address, role, password } = req.body;

//     if (password && password.trim() !== "") {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       await pool.query(
//         "UPDATE users SET name = $1, phone = $2, bio = $3, address = $4, role = $5, password = $6 WHERE id = $7",
//         [name, phone, bio, address, role, hashedPassword, userId],
//       );
//     } else {
//       await pool.query(
//         "UPDATE users SET name = $1, phone = $2, bio = $3, address = $4, role = $5 WHERE id = $6",
//         [name, phone, bio, address, role, userId], // Fixed parameter indexing here
//       );
//     }

//     res.json({ message: "Profile updated successfully!" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Ensure your auth routes handle the PUT request properly (in authRoutes.js):
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
// router.put("/profile", verifyToken, updateProfile); // This ensures 100% working edit profile

// module.exports = router;
// module.exports = { register, login, getUserProfile, updateProfile };

const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword],
    );
    res.status(201).json({
      message: "User registered successfully!",
      user: newUser.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password." });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password." });
    }
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await pool.query(
      "SELECT id, name, email, phone, bio, address, role FROM users WHERE id = $1",
      [userId],
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, bio, address, role, password } = req.body;

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await pool.query(
        "UPDATE users SET name = $1, phone = $2, bio = $3, address = $4, role = $5, password = $6 WHERE id = $7",
        [name, phone, bio, address, role, hashedPassword, userId],
      );
    } else {
      await pool.query(
        "UPDATE users SET name = $1, phone = $2, bio = $3, address = $4, role = $5 WHERE id = $6",
        [name, phone, bio, address, role, userId],
      );
    }
    res.json({ message: "Profile updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, getUserProfile, updateProfile };
