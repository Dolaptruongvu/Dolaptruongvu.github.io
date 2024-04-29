const express = require("express");
const router = express.Router();
const bookController = require("../Controller/bookController")
const reviewRouter = require("./reviewRoutes")
const billRouter = require("./billRoutes")
const {protect, isLoggedIn} = require("../Controller/authController")


// review Route
router.use("/:bookId/reviews", reviewRouter); 

// bill Route
router.use("/:bookId/bill",billRouter);

// Upload book cover (new route)
router.post("/upload-cover", bookController.uploadBookCover, (req, res, next) => {
    res.status(200).json({
      message: "Book cover uploaded successfully!",
    });
  });

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
