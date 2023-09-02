const Tour = require("../models/tourModels");
const Booking = require("../models/bookingModels");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const Stripe = require("stripe");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${
      req.tour.id
    }&user=${req.user.id}&price=${req.tour.price}&date=${
      req.date
    }&selectOption=${req.selectOption}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${req.tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.tour.id,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: req.tour.price * 100,
          product_data: {
            name: `${req.tour.name} Tour`,
            description: req.tour.summary,
            images: [`http://127.0.0.1:3000/img/tours/${req.tour.imageCover}`],
          },
        },
      },
    ],
  });

  res.status(200).json({
    status: "success",
    session,
  });
});

exports.checkAvailable = catchAsync(async (req, res, next) => {
  const tourId = req.params.tour.split(",")[0];
  const dateSelection = req.params.tour.split(",")[1];
  const selectionNumb = dateSelection.split("-")[1] * 1;
  const currentTour = await Tour.findById(tourId);
  if (!currentTour) {
    next(new AppError("no tour found", 404));
  }

  const participantsNumb =
    currentTour.startDates[selectionNumb - 1].participants;
  if (currentTour.maxGroupSize <= participantsNumb) {
    next(
      new AppError("Your tour date is full, please choose another date", 403)
    );
  }
  req.tour = currentTour;

  req.date = new Date(
    currentTour.startDates[selectionNumb - 1].dates
  ).toISOString();
  req.selectOption = selectionNumb;

  next();
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price, date, selectOption } = req.query;

  if (!tour && !user && !price && !date && !selectOption) return next();

  const option = selectOption * 1 - 1;
  const startDate = new Date(date);

  await Booking.create({ tour, user, price, startDate });

  const updateTour = await Tour.findById(tour);
  const participants = updateTour.startDates[option].participants;
  if (updateTour.maxGroupSize <= participants) {
    updateTour.startDates[option].soldOut = true;
    await updateTour.save();
  }
  res.redirect(req.originalUrl.split("?")[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
