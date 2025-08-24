const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authController");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Profile
router.get("/profile/:id", getProfile);

module.exports = router;
