const express = require("express");
const billController = require("../Controller/billController")
const bookController = require("../Controller/bookController")

const router = express.Router({ mergeParams: true });

router 
.route("/test")
.post(bookController.setBookUserIds,billController.createBill)


module.exports = router;