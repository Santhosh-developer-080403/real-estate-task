// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// const initializeDatabase = async () => {
//   try {
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         password TEXT NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );

//       CREATE TABLE IF NOT EXISTS properties (
//         id SERIAL PRIMARY KEY,
//         title VARCHAR(255) NOT NULL,
//         description TEXT,
//         city VARCHAR(100) NOT NULL,
//         property_type VARCHAR(100) NOT NULL,
//         price NUMERIC NOT NULL,
//         bedrooms INTEGER DEFAULT 0,
//         bathrooms INTEGER DEFAULT 0,
//         parking VARCHAR(255),
//         furnishing VARCHAR(100),
//         facing VARCHAR(50),
//         area_sqft NUMERIC,
//         images TEXT,
//         user_id INTEGER NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//         CONSTRAINT fk_properties_user
//         FOREIGN KEY (user_id)
//         REFERENCES users(id)
//         ON DELETE CASCADE
//       );

//       CREATE TABLE IF NOT EXISTS inquiries (
//         id SERIAL PRIMARY KEY,
//         property_id INTEGER NOT NULL,
//         user_id INTEGER,
//         name VARCHAR(255) NOT NULL,
//         email VARCHAR(255) NOT NULL,
//         phone VARCHAR(50) NOT NULL,
//         location VARCHAR(255),
//         message TEXT NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//         CONSTRAINT fk_inquiries_property
//         FOREIGN KEY (property_id)
//         REFERENCES properties(id)
//         ON DELETE CASCADE,

//         CONSTRAINT fk_inquiries_user
//         FOREIGN KEY (user_id)
//         REFERENCES users(id)
//         ON DELETE SET NULL
//       );
//     `);

//     // IMPORTANT: update existing Render DB column
//     await pool.query(`
//       ALTER TABLE properties
//       ALTER COLUMN parking TYPE VARCHAR(255)
//       USING parking::VARCHAR;
//     `);

//     console.log("Database tables initialized successfully!");
//   } catch (err) {
//     console.error("Database initialization error:", err);
//   }
// };
// pool
//   .connect()
//   .then(async (client) => {
//     console.log("PostgreSQL Database Connected Successfully!");
//     client.release();

//     await initializeDatabase();
//   })
//   .catch((err) => {
//     console.error("Database connection error:", err.stack);
//   });

// module.exports = pool;

const { Pool, Client } = require("pg");
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL;

// 1. Auto-create Database if missing
async function ensureDatabaseExists() {
  if (!dbUrl) return;

  try {
    const urlParts = new URL(dbUrl);
    const targetDbName = urlParts.pathname.substring(1);

    urlParts.pathname = "/postgres";
    const systemDbUrl = urlParts.toString();

    const client = new Client({ connectionString: systemDbUrl });
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDbName],
    );

    if (res.rowCount === 0) {
      console.log(`Database "${targetDbName}" missing. Creating now...`);
      await client.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`Database "${targetDbName}" created successfully!`);
    }

    await client.end();
  } catch (err) {
    console.error("Auto DB creation check failed:", err.message);
  }
}

// 2. Initialize Pool
const pool = new Pool({
  connectionString: dbUrl,
});

// 3. Create Tables & Run Migrations
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(50),
        bio TEXT,
        address TEXT,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        city VARCHAR(100) NOT NULL,
        property_type VARCHAR(100) NOT NULL,
        price NUMERIC NOT NULL,
        bedrooms INTEGER DEFAULT 0,
        bathrooms INTEGER DEFAULT 0,
        parking VARCHAR(255),
        furnishing VARCHAR(100),
        facing VARCHAR(50),
        area_sqft NUMERIC,
        images TEXT,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_properties_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        property_id INTEGER NOT NULL,
        user_id INTEGER,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        location VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_inquiries_property
        FOREIGN KEY (property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE,

        CONSTRAINT fk_inquiries_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
      );
    `);

    // ALTER migrations for existing DBs
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

      ALTER TABLE properties 
      ALTER COLUMN parking TYPE VARCHAR(255) 
      USING parking::VARCHAR;
    `);

    console.log("Database tables & schemas updated successfully!");
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
};

// 4. Run Sequential setup
async function setupDatabase() {
  await ensureDatabaseExists();

  try {
    const client = await pool.connect();
    console.log("PostgreSQL Database Connected Successfully!");
    client.release();

    await initializeDatabase();
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
}

setupDatabase();

module.exports = { pool, ensureDatabaseExists };
