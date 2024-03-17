const express = require("express");
const router = express.Router();
const filmController = require("../Controller/filmController")

router 
.route("/test")
.get(filmController.testapi)


module.exports = router;