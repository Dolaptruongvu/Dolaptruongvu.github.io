
const AppError = require("../utils/appError")
const { catchAsync } = require("../utils/catchAsync")
const handlerFactory = require("./handlerFactory")
const Film = require("../Model/filmModel")


exports.testapi = catchAsync( async (req,res,next) =>{
    res.status(200).json({
        status: "success",
        data: "hello"
    })
})

exports.createFilm = handlerFactory.createOne(Film);


