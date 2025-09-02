// Fcaor testing only in system
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_key"; // Change in production

// Register user
exports.register = (req, res) => {
    const { name, email, password, phone } = req.body;

    const sql = "INSERT INTO users (name, email, password, phone) VALUES (?,?,?,?)";
    db.query(sql, [name, email, password, phone], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "User registered successfully!" });
    });
};

// Login user
exports.login = (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email=?";
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(400).json({ error: "User not found" });

        const user = results[0];

        // Plain password check
        if (password !== user.password) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token, user });
    });
};

// Get user profile
exports.getProfile = (req, res) => {
    const sql = "SELECT id, name, email, phone FROM users WHERE id=?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result[0]);
    });
};
