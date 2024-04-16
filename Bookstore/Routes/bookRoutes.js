const express = require("express");
const router = express.Router();
const bookController = require("../Controller/bookController")

//creating book
router 
.route("/create")
.post(bookController.createBook)

//Get all books
router.get("/", bookController.allBook);




module.exports = router;
