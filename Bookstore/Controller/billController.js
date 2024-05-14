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


exports.createCheckoutSession = catchAsync(async (req, res, next) => {
    const billId = req.body.billId;

    const bill = await Bill.findById(billId);
    if (!bill) {
        return next(new AppError("Cannot find bill", 403));
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], 
        line_items: [
            {
                price_data: {
                    currency: 'usd', 
                    product_data: {
                        name: `Bill Payment of ${bill.customer.name}`,
                        description: `Bill ID: ${billId}`,
                    },
                    unit_amount: bill.price * 100, 
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/homepage.html`,
        cancel_url: `http://localhost:3000/cancel.html`,
    });

    res.status(200).json({ session });
});
