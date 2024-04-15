const express = require("express");
const router = express.Router();
const bookController = require("../Controller/bookController")

//creating book
router 
.route("/create")
.post(bookController.createBook)

//Get all books
router.get("/", bookController.allBook);

//Get one book
router.get("/:id", bookController.oneBook);

//Update book
router.get("/:id", bookController.updateBook);

//Delete book
router.get("/:id", bookController.deleteBook);

module.exports = router;
