const express = require("express");
const viewsController = require("../Controllers/viewsController");
const authController = require("../Controllers/authController");
const boookingController = require("../Controllers/bookingController");
const toursController = require("../Controllers/toursController");
const router = express.Router();

router.get(
  "/",
  boookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);

router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
router.get(
  "/top-5-tours",
  toursController.aliasTopTours,
  viewsController.getOverview
);

router.get("/login", authController.isLoggedIn, viewsController.login);
router.get("/login/forgot-password", viewsController.forgotPasswordPage);
router.get(
  "/login/forgot-password/sentMailAlert",
  viewsController.sentForgotSuccessfully
);
router.get("/login/2FA/:userId", viewsController.otpPage);

router.get("/signup", viewsController.signupPage);
router.get(
  "/me/confirmEmail/sentConfirmAlert",
  viewsController.sentConfirmSuccessfully
);

router.get(
  "/chatRoom/:tourId",
  authController.protect,
  authController.roomDecide,
  viewsController.chatPage
);
router.get("/me", authController.protect, viewsController.getAccount);
router.get(
  "/me/security",
  authController.protect,
  viewsController.securityPage
);
router.get(
  "/me/security/confirmOTP",
  authController.protect,
  viewsController.confirmSecurityPage
);
router.get("/my-tours", authController.protect, viewsController.getMyTours);
router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
