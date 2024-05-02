const express = require("express");
const viewsController = require("../Controller/viewsController"); 
const authController = require("../Controller/authController");

const router = express.Router();

//login page
router.get(
  "/login", 
  authController.isLoggedIn,
  viewsController.getLogin
);

//overview page
router.get(
  "/", 
  authController.isLoggedIn,
  viewsController.getOverview
);

module.exports = router;
