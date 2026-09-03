const pool = require("../config/db");

// Get All Properties
const getProperties = async (req, res) => {
  try {
    const {
      search,
      city,
      property_type,
      budget_range,
      bedrooms,
      sort,
      page = 1,
      limit = 6,
    } = req.query;

    let query = `SELECT * FROM properties WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) FROM properties WHERE 1=1`;
    let values = [];
    let countValues = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND title ILIKE $${paramIndex}`;
      countQuery += ` AND title ILIKE $${paramIndex}`;
      values.push(`%${search}%`);
      countValues.push(`%${search}%`);
      paramIndex++;
    }

    if (city) {
      query += ` AND city ILIKE $${paramIndex}`;
      countQuery += ` AND city ILIKE $${paramIndex}`;
      values.push(`%${city}%`);
      countValues.push(`%${city}%`);
      paramIndex++;
    }

    if (property_type) {
      query += ` AND property_type ILIKE $${paramIndex}`;
      countQuery += ` AND property_type ILIKE $${paramIndex}`;
      values.push(`%${property_type}%`);
      countValues.push(`%${property_type}%`);
      paramIndex++;
    }

    if (bedrooms) {
      query += ` AND bedrooms = $${paramIndex}`;
      countQuery += ` AND bedrooms = $${paramIndex}`;
      values.push(Number(bedrooms));
      countValues.push(Number(bedrooms));
      paramIndex++;
    }

    if (sort === "price_asc") {
      query += ` ORDER BY price ASC`;
    } else if (sort === "price_desc") {
      query += ` ORDER BY price DESC`;
    } else {
      query += ` ORDER BY id DESC`;
    }

    const offset = (Number(page) - 1) * Number(limit);
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(Number(limit), offset);

    const countResult = await pool.query(countQuery, countValues);
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / Number(limit));

    const result = await pool.query(query, values);

    res.json({
      properties: result.rows,
      totalPages: totalPages || 1,
      currentPage: Number(page),
      totalCount,
    });
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Single Property
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await pool.query(
      "SELECT * FROM properties WHERE id = $1",
      [id],
    );
    if (property.rows.length === 0) {
      return res.status(404).json({ error: "Property not found." });
    }
    res.json(property.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get My Properties
const getMyProperties = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM properties WHERE user_id = $1 ORDER BY id DESC",
      [userId],
    );
    res.json(result.rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Server error while fetching user properties" });
  }
};

// Create Property
// Create Property
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      city,
      property_type,
      price,
      bedrooms,
      bathrooms,
      parking,
      furnishing,
      facing,
      area_sqft,
    } = req.body;

    const imagePaths =
      req.files && Array.isArray(req.files)
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];
    const imagesString = JSON.stringify(imagePaths);

    const query = `
      INSERT INTO properties 
      (title, description, city, property_type, price, bedrooms, bathrooms, parking, furnishing, facing, area_sqft, images, user_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING *;
    `;

    // FIX: Ellathaையும் explicitly Number-ah convert panniyachu, so type mismatch varathu!
    const values = [
      title,
      description,
      city,
      property_type,
      Number(price),
      Number(bedrooms),
      Number(bathrooms),
      parking,
      furnishing,
      facing,
      Number(area_sqft),
      imagesString,
      req.user.id,
    ];
    
    const newProperty = await pool.query(query, values);

    res.status(201).json({
      message: "Property created successfully",
      property: newProperty.rows[0],
    });
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(500).json({ message: "Server error while creating property" });
  }
};

// Update Property
const updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user.id;

    // 1. First intha property antha user-oda thaan irukku nu check panrom (Security)
    const propertyCheck = await pool.query(
      "SELECT * FROM properties WHERE id = $1",
      [propertyId]
    );
    if (propertyCheck.rows.length === 0) {
      return res.status(404).json({ error: "Property not found." });
    }
    if (propertyCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this property." });
    }

    const { 
      title, description, city, property_type, 
      price, bedrooms, bathrooms, parking, 
      furnishing, facing, area_sqft 
    } = req.body;

    // 2. PostgreSQL $1, $2 placeholder syntax-oda query ezhuthrom (Images touch aagathu, so old images safe-a irukkum)
    const query = `
      UPDATE properties 
      SET title = $1, description = $2, city = $3, property_type = $4, 
          price = $5, bedrooms = $6, bathrooms = $7, parking = $8, 
          furnishing = $9, facing = $10, area_sqft = $11 
      WHERE id = $12
      RETURNING *;
    `;

    const values = [
      title, 
      description, 
      city, 
      property_type, 
      Number(price), 
      Number(bedrooms), 
      Number(bathrooms), 
      parking, 
      furnishing, 
      facing, 
      Number(area_sqft), 
      propertyId
    ];

    const updatedProperty = await pool.query(query, values);

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty.rows[0] // PostgreSQL response structure-ku ithu thaan correct
    });

  } catch (err) {
    console.error("Error updating property:", err);
    res.status(500).json({ error: "Failed to update property" });
  }
};
// Delete Property
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const propertyCheck = await pool.query(
      "SELECT * FROM properties WHERE id = $1",
      [id],
    );
    if (propertyCheck.rows.length === 0)
      return res.status(404).json({ error: "Property not found." });
    if (propertyCheck.rows[0].user_id !== userId)
      return res.status(403).json({ error: "Unauthorized." });

    await pool.query("DELETE FROM properties WHERE id = $1", [id]);
    res.json({ message: "Property deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};
