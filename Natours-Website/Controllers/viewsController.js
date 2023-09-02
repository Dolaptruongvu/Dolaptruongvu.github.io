const Tour = require("../models/tourModels");
const User = require("../models/userModels");
const Booking = require("../models/bookingModels");
const { catchAsync } = require("../utils/catchAsync");
const { render } = require("../app");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apifeatures");

exports.getOverview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  } else if (req.params.userId) {
    filter = { user: req.params.userId };
  }

  const feature = new APIFeatures(Tour.find(filter), req.query);
  feature.filter().sort().limit().paginate();
  const tours = await feature.query;

  res.status(200).render("overview", {
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  if (!tour) {
    return next(new AppError("There is no tour with that name", 404));
  }
  // Check user booked
  let userBooked = false;
  if (res.locals.user) {
    const userID = res.locals.user.id;
    const userBookings = await Booking.findOne({ user: userID, tour: tour.id });
    if (userBookings) userBooked = true;
  }

  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
    userBooked,
  });
});
exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

exports.signupPage = catchAsync(async (req, res, next) => {
  res.status(200).render("signup");
});

exports.forgotPasswordPage = catchAsync(async (req, res, next) => {
  res.status(200).render("forgotPassword");
});
exports.sentForgotSuccessfully = catchAsync(async (req, res, next) => {
  res.status(200).render("alert", {
    title: "The reset password link has been sent for you.",
  });
});
exports.sentConfirmSuccessfully = (req, res, next) => {
  res.status(200).render("alert", {
    title: "Your email has been confirm successfully",
  });
};
exports.resetPasswordView = catchAsync(async (req, res, next) => {
  res.status(200).render("resetPasswordView");
});

exports.securityPage = catchAsync(async (req, res, next) => {
  res.status(200).render("account/security", {
    activeSecurity: true,
  });
});
exports.chatPage = catchAsync(async (req, res, next) => {
  res.status(200).render("chatRoom");
});
exports.confirmSecurityPage = catchAsync(async (req, res, next) => {
  const phoneNumb = req.user.phoneNumber.toString();
  const lastDigits = phoneNumb.slice(-2);
  const phoneLength = phoneNumb.length - 1;
  const phoneNumberHide = "*".repeat(phoneLength) + lastDigits;

  res.status(200).render("smsOTP", {
    title: "Confirm your OTP code",
    phoneNumberHide,
  });
});

exports.getAccount = async (req, res) => {
  res.status(200).render(`account/setting`, {
    title: "Your account",
    activeSetting: true,
  });
};
exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});

exports.otpPage = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  const phoneNumb = user.phoneNumber.toString();
  const lastDigits = phoneNumb.slice(-2);
  const phoneLength = phoneNumb.length - 1;
  const phoneNumberHide = "*".repeat(phoneLength) + lastDigits;

  res.status(200).render("smsOTP", {
    title: "Confirm your OTP code",
    user,
    phoneNumberHide,
  });
});
