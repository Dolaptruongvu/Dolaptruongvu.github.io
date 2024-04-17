const express = require("express");
const router = express.Router();
const bookController = require("../Controller/bookController")
const reviewRouter = require("./reviewRoutes")

// review Route
router.use("/:bookId/reviews", reviewRouter); 



//creating book
router 
.route("/create")
.post(bookController.createBook)

//Get all books
router.get("/", bookController.allBook);

//Get one book
router
.route("/:id")
.get(bookController.oneBook)
.patch(bookController.updateBook)
.delete(bookController.deleteBook)

module.exports = router;
