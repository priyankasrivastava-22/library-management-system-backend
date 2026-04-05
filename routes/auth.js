const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getProfile
} = require("../controllers/authController");

// register route
router.post("/register", register);

// login route
router.post("/login", login);

// get profile route
router.get("/profile/:id", getProfile);

module.exports = router;