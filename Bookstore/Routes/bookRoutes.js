const express = require("express");
const router = express.Router();
const bookController = require("../Controller/bookController")

//creating book
router 
.route("/create")
.post(bookController.createBook)

//Get all books
router.get("/", bookController.allBook);

<<<<<<< HEAD


=======
//Get one book
router
.route("/:id")
.get(bookController.oneBook)
.patch(bookController.updateBook)
.delete(bookController.deleteBook)
>>>>>>> 6a123aaa31c9dc97c538cefaceb48216226e065b

module.exports = router;
