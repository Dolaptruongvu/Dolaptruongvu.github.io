const express = require("express");
const billController = require("../Controller/billController")
const bookController = require("../Controller/bookController")

const router = express.Router({ mergeParams: true });

router 
.route("/")
.post(billController.setShipperId,billController.createBill)
.get(billController.getBills)


module.exports = router;