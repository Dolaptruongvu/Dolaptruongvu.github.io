const express = require("express");
const fs = require("fs");
const toursController = require("../Controllers/toursController");
const router = express.Router();
const authController = require("../Controllers/authController");
const reviewRouter = require("./reviewsRoutes");
const bookingRouter = require("./bookingRoutes");

router.use("/:tourId/reviews", reviewRouter); 

router.use("/:tourId/bookings", bookingRouter);

router
  .route("/top-5-cheap")
  .get(toursController.aliasTopTours, toursController.getAllTours);

router.route("/tour-stats").get(toursController.getTourStats);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(toursController.getToursWithin);

router.route("/distances/:latlng/unit/:unit").get(toursController.getDistances);

router
  .route("/")
  .get(toursController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    toursController.createTour
  );

router
  .route("/:id")
  .get(toursController.getTourByID)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    toursController.uploadTourImages,
    toursController.resizeTourImages,
    toursController.patchTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    toursController.deleteTour
  );

// router
// .route('/:tourId/reviews')
// .post(protect,restrictTo('user'),createReview)

module.exports = router;
