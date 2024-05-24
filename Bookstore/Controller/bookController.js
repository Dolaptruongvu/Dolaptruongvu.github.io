const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const Book = require("../Model/bookModel");
const multer = require("multer");

//Cover storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'Public', 'Img', 'Books'));  // Adjust path based on your directory structure
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

//Create books
exports.createBook = upload.single("images"), // Upload single image
  catchAsync(async (req, res, next) => {
    // Validate book data (including title, author, etc.)
    const newBook = await Book.create({
      ...req.body,
      images: req.file.filename, // Add cover image filename
    });

    res.status(201).json({
      status: "success",
      data: {
        book: newBook,
      },
    });
  });

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
