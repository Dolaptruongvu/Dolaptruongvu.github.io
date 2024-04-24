const express = require("express");
const router = express.Router();
const bookController = require("../Controller/bookController")
const reviewRouter = require("./reviewRoutes")
const {protect, isLoggedIn} = require("../Controller/authController")

// review Route
router.use("/:bookId/reviews", reviewRouter); 



//creating book
router 
.route("/create")
.post(bookController.createBook)

//Get all books
router.get("/",protect, bookController.allBook);

// Filter books by category
router.get("/", bookController.filterBooksByCategory);

//Get one book,Update book, delete book
router
.route("/:id")
.get(bookController.oneBook)
.patch(bookController.updateBook)
.delete(bookController.deleteBook)

module.exports = router;
