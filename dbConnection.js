const postgres = require('postgres');
require('dotenv').config(); // Load environment variables from .env file

// const sql = postgres({
//   host: process.env.DB_HOST, // Postgres server
//   port: process.env.DB_PORT, // Postgres server port
//   database: process.env.DB_NAME, // Database name
//   username: process.env.DB_USER, // Database username
//   password: process.env.DB_PASS, // Database password
// });

// Connection string - alternative way to connect to the database
const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const sql = postgres(connectionString);

//function to test the connection to the database
const testConnection = async () => {
  try {
    await sql`SELECT 1 AS result`;
    console.log('✅ Connection to database successful');
  } catch (error) {
    console.error('❌ Connection to database failed:', error);
    throw error; // Re-throw the error to handle it in the server file
  }
};

module.exports = { sql, testConnection };
