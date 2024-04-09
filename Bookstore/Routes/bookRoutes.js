const express = require("express");
const router = express.Router();
const bookController = require("../Controller/bookController")

router 
.route("/test")
.post(bookController.createBook)


module.exports = router;
