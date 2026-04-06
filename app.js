require("dotenv").config();
console.log("DB PASS:", process.env.DB_PASS);

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

// CREATE APP 
const app = express();
const PORT = process.env.PORT || 5000;

// DB
const db = require("./config/db");

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());   

// ================= ROUTES =================
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const transactionRoutes = require("./routes/transactions");
const statsRoutes = require("./routes/stats");
const usersRoutes = require("./routes/users");
const dashboardRoutes = require("./routes/dashboard");

app.get("/ping", (req, res) => {
  console.log("ping hit");
  res.json({ message: "pong" });
});

app.get("/test-db", async (req, res) => {
  console.log("test-db hit");

  try {
    const [rows] = await db.query("SELECT 1");
    res.json({ message: "DB working" });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json(err);
  }
});

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Library backend is running!");
});

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ================= CSV UPLOAD =================
const upload = multer({ dest: "uploads/" });

app.post("/api/upload/books", upload.single("file"), async (req, res) => {
  try {
    const rows = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", async () => {
        for (const row of rows) {
          const {
            section_id,
            category_id,
            title,
            author,
            publisher,
            stock,
            review,
            approved,
          } = row;

          await db.query(
            `INSERT INTO books 
            (section_id, category_id, title, author, publisher, stock, review, approved)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              section_id,
              category_id,
              title,
              author,
              publisher,
              stock,
              review || "",
              approved || 0,
            ]
          );
        }

        fs.unlinkSync(req.file.path);
        res.json({ message: "Books uploaded successfully" });
      });
  } catch (err) {
    console.error("CSV upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});