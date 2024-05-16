const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const Book = require("../Model/bookModel");
const multer = require("multer");

//upload picture
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "D:/TruongVu-dev-project/Bookstore/Public/Img/Books"); //Storage place
  },
  filename: (req, file, cb) => {
    const { title } = req.body; // Extract book title from request body
    if (!title) {
      return cb(new Error("Book title is required"));
    }
    const safeTitle = title.replace(/\s+/g, ""); //Remove spaces
    cb(null, `${safeTitle}-cover.jpg`); //"-cover.jpg"
  },
});
const upload = multer({ storage });

exports.uploadBookCover = upload.single("bookCover"); // Change bookCover to front-end html

//Create books
exports.createBook = handlerFactory.createOne(Book);

//Read books
exports.allBook = handlerFactory.getAll(Book);
exports.oneBook = handlerFactory.getOne(Book);

//Update books
exports.updateBook = handlerFactory.updateOne(Book);

//Delete books
exports.deleteBook = handlerFactory.deleteOne(Book);

//Read book by filter
// exports.filterBooksByCategory = catchAsync(async (req, res, next) => {
//     const { category } = req.query; // Get the category from query string

//       const query = category ? { category } : {}; // Build the query object
//       const books = await Book.find(query); // Find books matching the query

//       res.status(200).json({
//         status: "success",
//         results: books.length,
//         data: {
//           books,
//         },
//       });

//   })
exports.filterBooksByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.query; // Get the category from query string

  let query = {};
  if (category) {
    const categories = category.split(","); // Split the category string into an array of categories
    query = { category: { $in: categories } }; // Use $in to match any of the categories
  }

  const books = await Book.find(query); // Find books matching the query

  res.status(200).json({
    status: "success",
    results: books.length,
    data: {
      books,
    },
  });
});

exports.setBookUserIds = (req, res, next) => {
  if (!req.body.book) req.body.book = req.params.bookId;

  //   if (!req.body.customer) req.body.customer = req.customer.id;
  next();
};

exports.filterBooksByRating = catchAsync(async (req, res, next) => {
  const books = await Book.find({ ratings: { $gt: 4 } }); // $gt selects those documents where the value is greater than 4

  res.status(200).json({
    status: "success",
    results: books.length,
    data: {
      books,
    },
  });
});
