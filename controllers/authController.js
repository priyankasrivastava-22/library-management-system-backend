const db = require("../config/db");
const jwt = require("jsonwebtoken");

// using secret for token (later move to .env)
const JWT_SECRET = "your_jwt_secret_key";

// ================= REGISTER =================
exports.register = async (req, res) => {

    // getting data from frontend
    const { name, email, password, phone } = req.body;

    // checking required fields
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required"
        });
    }

    try {
        // checking if user already exists
        const [existingUsers] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        // if user already present
        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // inserting new user
        await db.query(
            "INSERT INTO users (name, email, password, phone) VALUES (?,?,?,?)",
            [name, email, password, phone]
        );

        // sending success response
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (err) {
        // handling database error
        res.status(500).json({
            success: false,
            message: "Database error",
            error: err.message
        });
    }
};

// ================= LOGIN =================
exports.login = async (req, res) => {

    console.log("login api hit");

    // getting data from request body
    const { email, password } = req.body;

    console.log("body:", req.body);

    // validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
        console.log("before db query");

        // fetching user
        const [results] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        console.log("after db query");

        // user not found
        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = results[0];

        // checking password (plain for now)
        if (password !== user.password) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        // generating token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // sending response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (err) {
        // handling database error
        console.error("login error:", err);

        res.status(500).json({
            success: false,
            message: "Database error",
            error: err.message
        });
    }
};

// ================= PROFILE =================
exports.getProfile = async (req, res) => {

    // getting user id from params
    const userId = req.params.id;

    try {
        // fetching user profile
        const [result] = await db.query(
            "SELECT id, name, email, phone FROM users WHERE id = ?",
            [userId]
        );

        // user not found
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // sending user data
        res.status(200).json({
            success: true,
            user: result[0]
        });

    } catch (err) {
        // handling database error
        res.status(500).json({
            success: false,
            message: "Database error",
            error: err.message
        });
    }
};