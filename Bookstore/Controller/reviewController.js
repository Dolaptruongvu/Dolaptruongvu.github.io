const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const Review = require("../Model/reviewModel");

exports.setBookUserIds = (req, res, next) => {
  if (!req.body.book) req.body.book = req.params.bookId;

  //   if (!req.body.customer) req.body.customer = req.customer.id;
  next();
};

exports.createReview = handlerFactory.createOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.getReview = handlerFactory.getOne(Review);
exports.getAllReviews = handlerFactory.getAll(Review);
