
const AppError = require("../utils/appError")
const { catchAsync } = require("../utils/catchAsync")
const handlerFactory = require("./handlerFactory")
const Book = require("../Model/bookModel")


exports.testapi = catchAsync( async (req,res,next) =>{
    res.status(200).json({
        status: "success",
        data: "hello"
    })
})

exports.createBook = handlerFactory.createOne(Book);


