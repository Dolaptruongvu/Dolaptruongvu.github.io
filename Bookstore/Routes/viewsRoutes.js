const express = require("express");
const viewsController = require("../Controller/viewsController"); 
const authController = require("../Controller/authController");

const router = express.Router();
//overview page
router.get(
  "/", 
  authController.isLoggedIn,
  viewsController.getOverview
);
//login page
router.get(
  "/login", 
  authController.isLoggedIn,
  viewsController.getLogin
);

module.exports = router;
