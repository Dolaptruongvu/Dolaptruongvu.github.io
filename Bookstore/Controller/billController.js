
const AppError = require("../utils/appError")
const { catchAsync } = require("../utils/catchAsync")
const handlerFactory = require("./handlerFactory")
const Bill = require("../Model/billModel")



exports.createBill = handlerFactory.createOne(Bill);


