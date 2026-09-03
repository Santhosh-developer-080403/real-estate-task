const {pool} = require("../config/db");

// Send Inquiry (Supports Guests + Logged-in users with Name, Email, Phone, Location, Message)
const sendInquiry = async (req, res) => {
  try {
    const { property_id, name, email, phone, location, message } = req.body;

    // req.user might be undefined if user is a guest (optional auth)
    const user_id = req.user ? req.user.id : null;

    if (!property_id || !name || !email || !phone || !message) {
      return res
        .status(400)
        .json({ error: "Please fill all required fields." });
    }

    // Check if property exists
    const property = await pool.query(
      "SELECT * FROM properties WHERE id = $1",
      [property_id],
    );
    if (property.rows.length === 0) {
      return res.status(404).json({ error: "Property not found." });
    }

    // Prevent owner from inquiring on their own property (if user is logged in and owner_id column exists)
    const propertyData = property.rows[0];
    if (user_id && propertyData.owner_id && propertyData.owner_id === user_id) {
      return res
        .status(400)
        .json({ error: "You cannot send an inquiry on your own property." });
    }

    // Insert inquiry including new fields
    const newInquiry = await pool.query(
      `INSERT INTO inquiries (property_id, user_id, name, email, phone, location, message) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [property_id, user_id, name, email, phone, location, message],
    );

    res.status(201).json({
      message: "Inquiry sent successfully!",
      inquiry: newInquiry.rows[0],
    });
  } catch (err) {
    // PostgreSQL unique violation error code (23505)
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ error: "You have already sent an inquiry for this property." });
    }
    console.error("Inquiry error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get Inquiries for Owner's Properties
// const getPropertyInquiries = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const inquiries = await pool.query(
//       `SELECT i.*, p.title FROM inquiries i
//        JOIN properties p ON i.property_id = p.id
//        WHERE p.owner_id = $1 ORDER BY i.created_at DESC`,
//       [userId],
//     );
//     res.json(inquiries.rows);
//     console.log("Logged-in user ID:", userId);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const getPropertyInquiries = async (req, res) => {
  try {
    const userId = req.user.id;

    const inquiries = await pool.query(
      `SELECT 
         i.*,
         p.title AS property_title
       FROM inquiries i
       JOIN properties p ON i.property_id = p.id
       WHERE p.user_id = $1
       ORDER BY i.created_at DESC`,
      [userId],
    );

    res.status(200).json(inquiries.rows);
  } catch (err) {
    console.error("GET INQUIRIES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendInquiry, getPropertyInquiries };
