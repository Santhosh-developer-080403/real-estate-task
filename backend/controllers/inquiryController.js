const pool = require("../config/db");

// Send Inquiry (With duplicate prevention)
const sendInquiry = async (req, res) => {
  try {
    const { property_id, message } = req.body;
    const user_id = req.user.id; // From auth middleware

    // Check if property exists
    const property = await pool.query(
      "SELECT * FROM properties WHERE id = $1",
      [property_id],
    );
    if (property.rows.length === 0) {
      return res.status(404).json({ error: "Property not found." });
    }

    // Prevent owner from inquiring on their own property
    if (property.rows.id === user_id) {
      return res
        .status(400)
        .json({ error: "You cannot send an inquiry on your own property." });
    }

    // Insert inquiry (Unique constraint in DB prevents duplicates)
    const newInquiry = await pool.query(
      "INSERT INTO inquiries (property_id, user_id, message) VALUES ($1, $2, $3) RETURNING *",
      [property_id, user_id, message],
    );

    res
      .status(201)
      .json({
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
    res.status(500).json({ error: err.message });
  }
};

// Get Inquiries for Owner's Properties
const getPropertyInquiries = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await pool.query(
      `Iquiries... SELECT i.*, p.title FROM inquiries i 
             JOIN properties p ON i.property_id = p.id 
             WHERE p.owner_id = $1 ORDER BY i.created_at DESC`,
      [userId],
    );
    res.json(inquiries.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendInquiry, getPropertyInquiries };
