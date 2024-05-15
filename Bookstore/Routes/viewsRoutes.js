const express = require("express");
const viewsController = require("../Controller/viewsController");
const authController = require("../Controller/authController");

const router = express.Router();

//login page
router.get("/login", authController.isLoggedIn, viewsController.getLogin);

router.get("/signup", authController.isLoggedIn, viewsController.getSignup);

router.get("/signup", authController.isLoggedIn, viewsController.getSignup);

//overview page
router.get("/", authController.isLoggedIn, viewsController.getOverview);

// filtered books

router
  .route("/filter")
  .get(authController.isLoggedIn, viewsController.filteredBooks);

// get shipping bills
router
  .route("/shippingBills")
  .get(
    authController.protect,
    authController.restrictTo("shipper"),
    viewsController.getShipBills
  );

module.exports = router;
