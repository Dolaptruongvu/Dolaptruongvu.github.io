const mongoose = require("mongoose");
const Book = require("./bookModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty"],
    },
    rating: {
      type: Number,
      min: [1, "the rating should be greater or equal to 1"],
      max: [5, "The rating should be less than or equal to 5"],
      required: [true, "Review must has rating"],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
      required: [true, "Review must belong to a book."],
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: [true, "Review must belong to a customer"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ customer: 1, book: 1 }, { unique: true });
reviewSchema.index({ book: 1 });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "customer",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRating = async function (bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: "$book",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      ratingQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      ratingQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.book);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRating(this.r.book);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
