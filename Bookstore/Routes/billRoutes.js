const express = require("express");
const router = express.Router();
const billController = require("../Controller/billController")

router 
.route("/test")
.post(billController.createBill)


module.exports = router;