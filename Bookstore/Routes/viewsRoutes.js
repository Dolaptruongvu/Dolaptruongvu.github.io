const express = require("express");
const viewsController = require("../Controller/viewsController"); 
const authController = require("../Controller/authController");

const router = express.Router();

router.get(
  "/", 
  authController.isLoggedIn,
  viewsController.getOverview
);

module.exports = router;
