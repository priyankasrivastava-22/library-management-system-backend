// const mysql = require("mysql2/promise");
// require("dotenv").config();   

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,   
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// console.log(" MySQL pool initialized");

// module.exports = db;


const mysql = require("mysql2/promise");
const fs = require("fs"); // Added to read the certificate file
const path = require("path");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 12345, // Aiven uses a specific port, not 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    // This tells MySQL to use the Aiven CA certificate
    ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
  },
});

console.log("MySQL pool initialized with SSL");

module.exports = db;