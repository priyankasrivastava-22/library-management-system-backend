const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// Get all books
router.get("/", bookController.getBooks);

// Add book
router.post("/", bookController.addBook);

// Delete book
router.delete("/:id", bookController.deleteBook);

module.exports = router;
