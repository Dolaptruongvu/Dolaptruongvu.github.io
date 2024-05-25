const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const Bill = require("../Model/billModel");
const Customer = require("../Model/customerModel");
const stripe = require("stripe")(
  "sk_test_51PABiLDfNmKHuQemhXjI6l5u2yws9mThmNOfdbvJKUqSb7ILv7bLUGqdWm3ZxcKiRewofG945fWtiG5U5LxOfx3X00dcCBnNvV"
);

exports.createBill = catchAsync(async (req, res, next) => {
  const user = res.locals.customer;
  const doc = await Bill.create({ ...req.body, customer: user.id });

  res.status(201).json({
    status: "success",
    data: doc,
  });
});
// handlerFactory.createOne(Bill);

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
  const bills = await Bill.find({ shipper: req.customer.id });

  res.status(200).json({
    status: "success",
    data: bills,
  });
});

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const billId = req.params.id; //change from body to params

  const bill = await Bill.findById(billId);
  if (!bill) {
    return next(new AppError("Cannot find bill", 403));
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Bill Payment of ${bill.customer.name}`,
            description: `Bill ID: ${billId}`,
          },
          unit_amount: parseInt(bill.price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://127.0.0.1:3000/success/${bill.id}`, // Sửa lại link http
    cancel_url: `http://127.0.0.1:3000/fail/${bill.id}`, // sửa lại link http
  });
  try {
    const updatedBill = await Bill.findByIdAndUpdate(
      billId,
      { haspaid: true },
      { new: true }
    );
    if (!updatedBill) {
      console.error(`Error updating bill ${billId} payment status`);
    }
  } catch (error) {
    console.error(`Error updating bill ${billId} payment status:`, error);
  }
  res.json({ url: session.url });
});

exports.updatePay = catchAsync(async (req, res, next) => {
  const id = req.params.billId;
  await Bill.updateOne(
    {
      _id: id,
    },
    {
      haspaid: true,
    }
  );

  res.status(200).json({
    status: "success",
  });
});
