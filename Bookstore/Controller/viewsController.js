const Book = require("../Model/bookModel"); // Import the Book model
const { catchAsync } = require("../utils/catchAsync"); // Import catchAsync helper

exports.getOverview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.bookId) {
    filter = { _id: req.params.bookId }; // Filter by book ID
  }

  const sort = req.query.sort ? { [req.query.sort]: 1 } : { _id: 1 }; // Simple sorting

  const books = await Book.find(filter).sort(sort);

  res.status(200).render("book-filter", {
    books, // Pass the books data to the template
  });
});