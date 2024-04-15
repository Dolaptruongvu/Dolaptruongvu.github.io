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
