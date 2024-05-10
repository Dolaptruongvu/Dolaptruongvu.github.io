const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const Bill = require("../Model/billModel");
const Customer = require("../Model/customerModel");

exports.createBill = handlerFactory.createOne(Bill);

exports.getBills = handlerFactory.getAll(Bill);

exports.setPaymentStatus = catchAsync(async (req, res, next) => {
  const billId = req.params.id;
  const bill = await Bill.findByIdAndUpdate(
    billId,
    { haspaid: req.body.haspaid },
    { new: true }
  );
  if (!bill) {
    next(new AppError("Cannot find bill", 403));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});


exports.getShippingBill = catchAsync(async (req, res, next) => {
    

    const bills = await Bill.find({shipper: req.customer.id})
  
    res.status(200).json({
      status: "success",
      data: bills,
    });


 });