require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const bodyParser = require("body-parser");

// Routes (if you have separate route files, you can keep them)
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const transactionRoutes = require("./routes/transactions");
const statsRoutes = require("./routes/stats");
const usersRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: ["http://localhost:3002", "http://localhost:3001"], credentials: true }));
app.use(bodyParser.json());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "your_password",
  database: process.env.DB_NAME || "lms_db"
});

db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database!");
});

// Make db accessible in req
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Test route
app.get("/", (req, res) => res.send("Library backend is running!"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/users", usersRoutes);

// Multer for CSV upload
const upload = multer({ dest: "uploads/" });

// Example: bulk upload books
app.post("/api/upload/books", upload.single("file"), (req, res) => {
  const rows = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", data => rows.push(data))
    .on("end", () => {
      rows.forEach(row => {
        const { section_id, category_id, title, author, publisher, stock, review, approved } = row;
        const query = "INSERT INTO books (section_id, category_id, title, author, publisher, stock, review, approved) VALUES (?,?,?,?,?,?,?,?)";
        db.query(query, [section_id, category_id, title, author, publisher, stock, review, approved || 0]);
      });
      fs.unlinkSync(req.file.path);
      res.send("Books uploaded successfully!");
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = db;
