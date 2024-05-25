const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const Book = require("../Model/bookModel");
const multer = require("multer");

//Cover storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'E:/Bookstore/Public/Img/Books'); // Change 'uploads' to your desired folder path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${file.originalname}`;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });
exports.uploadBookCover = upload.single('images');

//Create books
exports.createBook = catchAsync(async (req, res, next) => {
let newBookData = {
    title: req.body.title,
    author: req.body.author,
    category: req.body.category,
    language: req.body.language,
    translator: req.body.translator,
    totalPages: req.body.totalPages,
    releaseDate: req.body.releaseDate,
    publisher: req.body.publisher,
    coverType: req.body.coverType,
    weight: req.body.weight,
    quantity: req.body.quantity,
    summary: req.body.summary,
    ratings: req.body.ratings,
    price: req.body.price,
  };
  
  // Check if image file was uploaded before adding filename
  if (req.file) {
    newBookData.images = [req.file.filename]; // Add filename to images array
  } else {
    newBookData.images = []; // Set images to an empty array if no file uploaded
  }

  const newBook = await Book.create(newBookData);

  res.status(201).json({
    status: 'success',
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
