const AppError = require("../utils/appError")
const { catchAsync } = require("../utils/catchAsync")
const handlerFactory = require("./handlerFactory")
const Book = require("../Model/bookModel")

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
exports.filterBooksByCategory = async (req, res, next) => {
    const { category } = req.query; // Get the category from query string
  
    try {
      const query = category ? { category } : {}; // Build the query object
      const books = await Book.find(query); // Find books matching the query
  
      res.status(200).json({
        status: "success",
        results: books.length,
        data: {
          books,
        },
      });
    } catch (err) {
      next(err); // Pass error to global error handler
    }
  };
