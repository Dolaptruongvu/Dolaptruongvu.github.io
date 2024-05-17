const express = require("express");
const viewsController = require("../Controller/viewsController");
const authController = require("../Controller/authController");

const router = express.Router();

//Book detail
router.get("/details/:bookId", viewsController.getBookDetail);

//Cart Items
router.get("/cart", viewsController.getCart);

//Contract & services
router.get("/contracts", viewsController.getContracts);

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

// profile
router
  .route("/profile")
  .get(authController.isLoggedIn, viewsController.getProfile);

// get shipping bills
router
  .route("/shippingBills")
  .get(
    authController.protect,
    authController.restrictTo("shipper"),
    viewsController.getShipBills
  );

module.exports = router;
