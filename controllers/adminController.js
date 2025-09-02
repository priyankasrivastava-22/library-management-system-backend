const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin login
exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admins WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "Invalid email or password" });

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token, admin: { id: admin.id, name: admin.name, role: admin.role } });
  });
};

// Get all admins (superadmin only)
exports.getAdmins = (req, res) => {
  db.query("SELECT id, name, email, role, created_at FROM admins", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
