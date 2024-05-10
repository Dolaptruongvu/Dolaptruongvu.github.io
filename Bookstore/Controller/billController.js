const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const Bill = require("../Model/billModel");
const Customer = require("../Model/customerModel");

exports.setShipperId = catchAsync(async (req, res, next) => {
  const shippers = await Customer.find({ // find shipper have numb of order less than 5
    role: "shipper",
    numbOfOrder: { $lt: 5 },
  });
  if (!shippers.length) {
    return next(new AppErrorError("No available shippers found.", 403));
  }
  const shipper = await Customer.findByIdAndUpdate(shippers[0].id,{ $inc: { numbOfOrder: 1 } },{ new: true }) // update numb of order in shipper
  req.body.shipper = shipper.id;
  console.log(shipper)
  next();
});
exports.createBill = handlerFactory.createOne(Bill);

exports.getBills = handlerFactory.getAll(Bill);
