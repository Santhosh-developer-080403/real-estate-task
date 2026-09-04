const { pool } = require("../config/db");

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

    if (budget_range) {
      const [minPrice, maxPrice] = budget_range.split("-").map(Number);

      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        query += ` AND price >= $${paramIndex} AND price <= $${paramIndex + 1}`;
        countQuery += ` AND price >= $${paramIndex} AND price <= $${paramIndex + 1}`;

        values.push(minPrice, maxPrice);
        countValues.push(minPrice, maxPrice);

        paramIndex += 2;
      }
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

    // users table-oda join panni name-ah 'owner_name' (illa 'username') nu edukurom
    const query = `
      SELECT properties.*, users.name AS owner_name, users.email AS owner_email, users.phone AS owner_phone
      FROM properties
      LEFT JOIN users ON properties.user_id = users.id
      WHERE properties.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(result.rows[0]);
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

    // const imagePaths =
    //   req.files && Array.isArray(req.files)
    //     ? req.files.map((file) => `/uploads/${file.filename}`)
    //     : [];
    // const imagesString = JSON.stringify(imagePaths);

    const imagePaths =
      req.files && Array.isArray(req.files)
        ? req.files.map((file) => file.path)
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

    // Check property exists
    const propertyCheck = await pool.query(
      "SELECT * FROM properties WHERE id = $1",
      [propertyId],
    );

    if (propertyCheck.rows.length === 0) {
      return res.status(404).json({
        error: "Property not found.",
      });
    }

    // Check ownership
    if (propertyCheck.rows[0].user_id !== userId) {
      return res.status(403).json({
        error: "Unauthorized to update this property.",
      });
    }

    const oldProperty = propertyCheck.rows[0];

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
      existingImages,
    } = req.body;

    // Preserve old values if frontend doesn't send them
    const finalTitle = title !== undefined ? title : oldProperty.title;

    const finalDescription =
      description !== undefined ? description : oldProperty.description;

    const finalCity = city !== undefined ? city : oldProperty.city;

    const finalPropertyType =
      property_type !== undefined ? property_type : oldProperty.property_type;

    const finalPrice =
      price !== undefined && price !== "" ? Number(price) : oldProperty.price;

    const finalBedrooms =
      bedrooms !== undefined && bedrooms !== ""
        ? Number(bedrooms)
        : oldProperty.bedrooms;

    const finalBathrooms =
      bathrooms !== undefined && bathrooms !== ""
        ? Number(bathrooms)
        : oldProperty.bathrooms;

    const finalParking = parking !== undefined ? parking : oldProperty.parking;

    const finalFurnishing =
      furnishing !== undefined ? furnishing : oldProperty.furnishing;

    const finalFacing = facing !== undefined ? facing : oldProperty.facing;

    const finalArea =
      area_sqft !== undefined && area_sqft !== ""
        ? Number(area_sqft)
        : oldProperty.area_sqft;

    // Handle images
    let finalImages = oldProperty.images;

    if (existingImages !== undefined) {
      try {
        const keptImages = JSON.parse(existingImages);

        const newImages =
          req.files && Array.isArray(req.files)
            ? req.files.map((file) => `/uploads/${file.filename}`)
            : [];

        finalImages = JSON.stringify([...keptImages, ...newImages]);
      } catch (imageError) {
        console.error("Image parsing error:", imageError);
      }
    }

    const query = `
      UPDATE properties
      SET
        title = $1,
        description = $2,
        city = $3,
        property_type = $4,
        price = $5,
        bedrooms = $6,
        bathrooms = $7,
        parking = $8,
        furnishing = $9,
        facing = $10,
        area_sqft = $11,
        images = $12
      WHERE id = $13
      RETURNING *;
    `;

    const values = [
      finalTitle,
      finalDescription,
      finalCity,
      finalPropertyType,
      finalPrice,
      finalBedrooms,
      finalBathrooms,
      finalParking,
      finalFurnishing,
      finalFacing,
      finalArea,
      finalImages,
      propertyId,
    ];

    const updatedProperty = await pool.query(query, values);

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty.rows[0],
    });
  } catch (err) {
    console.error("Error updating property:", err);
    res.status(500).json({
      error: err.message,
    });
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
