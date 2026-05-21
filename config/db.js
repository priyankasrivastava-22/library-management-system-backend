const mysql = require("mysql2/promise");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,

  // Only use SSL in production (Railway)
  ...(isProduction && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

console.log(`MySQL pool initialized (${isProduction ? "PROD" : "DEV"})`);

module.exports = db;