const express = require("express");
const fs = require("fs");
const authController = require("../Controllers/authController");
const userController = require("../Controllers/userController");
const viewsController = require("../Controllers/viewsController");
const bookingRouter = require("./bookingRoutes");

const router = express.Router();

router.use("/:userId/bookings", bookingRouter);

router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/signup", authController.signup);
router.post("/forgotPassword", authController.forgotPassword);

router
  .route("/resetPassword/:token")
  .get(viewsController.resetPasswordView)
  .patch(authController.resetPassword);

router.get("/confirmEmail/:token", authController.confirmEmail);

router
  .route("/2FA/:userId")
  .get(authController.sendSms2FA)
  .post(authController.confirmSms2FA);

router.use(authController.protect);

router.get("/security/:type", authController.checkSecurityType);
router.get("/me", userController.getMe, userController.getUser);
router.get("/sendConfirmEmail", authController.sendConfirmEmail);
router.patch("/updatePassword", authController.updatePassword);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updatedUser);

module.exports = router;
