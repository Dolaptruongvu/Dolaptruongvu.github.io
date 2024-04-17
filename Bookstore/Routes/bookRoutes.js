const express = require("express");
const router = express.Router();
const bookController = require("../Controller/bookController")

//creating book
router 
.route("/create")
.post(bookController.createBook)

//Get all books
router.get("/", bookController.allBook);

// Filter books by category
router.get("/", bookController.filterBooksByCategory);

//Get one book,Update book, delete book
router
.route("/:id")
.get(bookController.oneBook)
.patch(bookController.updateBook)
.delete(bookController.deleteBook)

module.exports = router;
