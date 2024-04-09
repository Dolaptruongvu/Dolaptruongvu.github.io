const AppError = require("../utils/appError")
const { catchAsync } = require("../utils/catchAsync")
const handlerFactory = require("./handlerFactory")
const Book = require("../Model/bookModel")

exports.createBook = handlerFactory.createOne(Book);