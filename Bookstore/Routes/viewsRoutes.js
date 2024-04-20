const express = require("express");
const viewsController = require("../Controller/viewsController"); // Use controllers folder
const authController = require("../Controller/authController"); // Use controllers folder

const router = express.Router();

router.get(
  "/", 
  authController.isLoggedIn, // Middleware to check if user is logged in
  viewsController.getOverview
);

module.exports = router;