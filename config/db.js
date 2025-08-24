// Import mysql2
const mysql = require("mysql2");

// MySQL connection configuration
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "OmNamahShivay@25",        // MySQL password
    database: "library_db"               // Database created
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database!");
});

module.exports = db;
