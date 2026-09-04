// const pool = require("./config/db"); // Unga database connection file path

// const cities = ["Chennai", "Coimbatore", "Madurai", "Trichy"];
// const propertyTypes = ["Villa", "Apartment", "House", "Plot"];
// const furnishings = ["Semi-Furnished", "Furnished", "Unfurnished"];
// const facings = ["East", "West", "North", "South"];
// const titles = [
//   "Modern Luxury Apartment with City View",
//   "Spacious Independent Villa with Garden",
//   "Cozy Family House",
//   "Premium Gated Community Plot",
//   "Elegant Duplex House near Main Road",
// ];

// const seedProperties = async () => {
//   try {
//     console.log("Seeding 70 properties within 0 - 2 Crores budget range...");

//     for (let i = 1; i <= 70; i++) {
//       const randomType =
//         propertyTypes[Math.floor(Math.random() * propertyTypes.length)];

//       // Plot-ku 0 bedrooms/bathrooms/parking, maththavetuku 1 to 5
//       const bedrooms =
//         randomType === "Plot" ? 0 : Math.floor(Math.random() * 5) + 1;
//       const bathrooms = bedrooms;
//       const parking =
//         randomType === "Plot" ? 0 : Math.floor(Math.random() * 3) + 1;

//       const title = `${titles[Math.floor(Math.random() * titles.length)]} #${i}`;
//       const description = `This is a premium ${randomType.toLowerCase()} located in prime area featuring great ventilation and modern amenities.`;
//       const city = "Chennai";

//       // Price strictly between 35 Lakhs to 2 Crores (Matches your filter dropdowns)
//       const price =
//         Math.floor(Math.random() * (20000000 - 3500000 + 1)) + 3500000;

//       const furnishing =
//         furnishings[Math.floor(Math.random() * furnishings.length)];
//       const facing = facings[Math.floor(Math.random() * facings.length)];
//       const area_sqft = Math.floor(Math.random() * (3500 - 600 + 1)) + 600;

//       // Sample images matching your uploads structure
//       const images = [
//         `/uploads/mock_${(i % 5) + 1}.jpg`,
//         `/uploads/mock_${((i + 1) % 5) + 1}.jpg`,
//       ];

//       const user_id = 1; // Valid owner user ID in your database

//       const query = `
//         INSERT INTO properties 
//         (title, description, city, property_type, price, bedrooms, bathrooms, parking, furnishing, facing, area_sqft, images, user_id) 
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
//       `;

//       const values = [
//         title,
//         description,
//         city,
//         randomType,
//         price,
//         bedrooms,
//         bathrooms,
//         parking,
//         furnishing,
//         facing,
//         area_sqft,
//         images,
//         user_id,
//       ];

//       await pool.query(query, values);
//     }

//     console.log(
//       "Successfully seeded 70 properties with correct budgets into database!",
//     );
//     process.exit(0);
//   } catch (err) {
//     console.error("Error seeding data:", err);
//     process.exit(1);
//   }
// };

// seedProperties();
