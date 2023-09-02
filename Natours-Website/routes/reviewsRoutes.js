const express = require("express");
const reviewController = require("../Controllers/reviewController");
const { protect, restrictTo } = require("../Controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .post(
    restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(restrictTo("admin", "user"), reviewController.deleteReview)
  .patch(restrictTo("admin", "user"), reviewController.updateReview);

module.exports = router;
