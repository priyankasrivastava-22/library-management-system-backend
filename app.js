const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const transactionRoutes = require("./routes/transactions");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/transactions", transactionRoutes);

// Test route
app.get("/", (req, res) => res.send("Library backend is running!"));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
