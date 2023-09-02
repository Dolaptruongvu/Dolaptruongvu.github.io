const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const Booking = require("../models/bookingModels");
const { catchAsync } = require("../utils/catchAsync");
const app = require("../utils/appError");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const crypto = require("crypto");
const Tour = require("../models/tourModels");
const { decode } = require("punycode");
const { json } = require("express");
const { Vonage } = require("@vonage/server-sdk");

const signToken = (id, secret, expire) => {
  return jwt.sign({ id }, secret, {
    expiresIn: expire,
  });
};
const sendSMS = async (otpVal, phoneNumber) => {
  const vonage = new Vonage({
    apiKey: "83366a15",
    apiSecret: "37ceON1JM4b5j1fF",
  });
  try {
    const from = "Vonage APIs";
    const to = `84${phoneNumber}`;
    const text = `This is your OTP code : ${otpVal}`;
    const resp = await vonage.sms.send({ to, from, text });
  } catch (err) {
    console.log(err);
  }
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(
    user._id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN
  );
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.checkSecurityType = catchAsync(async (req, res, next) => {
  if (req.params.type === "smsotp" && req.user.smsOTPStatus === false) {
    const url = `http://127.0.0.1:3000/api/v1/users/2FA/${req.user.id}`;

    return res.status(303).json({
      status: "success",
      data: {
        url,
      },
    });
  }
});
exports.sendSms2FA = catchAsync(async (req, res, next) => {
  const randomNumb = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  if(process.env.NODE_ENV ==='development') console.log(randomNumb)
  const otpValue = crypto
    .createHash("sha256")
    .update(randomNumb.toString())
    .digest("hex");
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    {
      smsOTPValue: otpValue,
      smsOTPExpires: Date.now() + 10 * 60 * 1000,
    },
    {
      runValidators: false,
      new: true,
    }
  );
  if (process.env.NODE_ENV === "production")
    await sendSMS(randomNumb, user.phoneNumber);

  if (user.smsOTPStatus === true) {
    const url = `http://127.0.0.1:3000/login/2FA/${user.id}`;

    res.status(301).redirect(url);
  } else if (user.smsOTPStatus === false) {
    const url = `http://127.0.0.1:3000/me/security/confirmOTP`;

    res.status(301).redirect(url);
  }
});

exports.confirmSms2FA = catchAsync(async (req, res, next) => {
  const smsOTPValue = req.body.smsOTPValue.toString();
  const hashOTP = crypto.createHash("sha256").update(smsOTPValue).digest("hex");
  const user = await User.findOne({
    _id: req.params.userId,
    smsOTPValue: hashOTP,
  });
  if (!user) next(new AppError("your OTP is wrong"));

  if (user.smsOTPExpires < Date.now())
    next(new AppError("your OTP has been expired"));

  if (!user.smsOTPStatus) {
    user.smsOTPStatus = true;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      status: "success",
      data: {
        smsOTPStatus: user.smsOTPStatus,
      },
    });
  }
  user.smsOTPExpires = undefined;
  user.smsOTPValue = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(
    newUser._id,
    process.env.JWT_EMAILSECRET,
    process.env.JWT_EMAILSECRET_EXPIRES_IN
  );

  const confirmEmailUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/confirmEmail/${token}`;

  await new Email(newUser, confirmEmailUrl).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.confirmEmail = catchAsync(async (req, res, next) => {
  let token = req.params.token;

  if (!token)
    next(new AppError("Cannot find your token, please confirm Email again"));

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_EMAILSECRET
  );
  const date = Date.now() / 1000;

  if (decoded.exp < date)
    next(new AppError("Your token has been expired", 400));

  const user = await User.findByIdAndUpdate(
    decoded.id,
    { emailConfirm: true },
    {
      runValidators: false,
      new: true,
    }
  );

  if (!user)
    next(new AppError("Cannot find your account in server, please try again"));

  res
    .status(301)
    .redirect("http://127.0.0.1:3000/me/confirmEmail/sentConfirmAlert");
});
exports.sendConfirmEmail = catchAsync(async (req, res, next) => {
  const newToken = signToken(
    req.user._id,
    process.env.JWT_EMAILSECRET,
    process.env.JWT_EMAILSECRET_EXPIRES_IN
  );
  const confirmEmailUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/confirmEmail/${newToken}`;
  await new Email(req.user, confirmEmailUrl).sendEmailConfirm();

  res.status(200).json({
    status: "success",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (user.smsOTPStatus) {
    return res.status(303).json({
      status: "success",
      data: {
        smsOTPStatus: user.smsOTPStatus,
        url: `/api/v1/users/2FA/${user.id}`,
      },
    });
  }
  createSendToken(user, 200, res);
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;

      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};
exports.logout = (req, res) => {
  res.cookie("jwt", "logouttoken", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in ! please log in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The token belonging to this token does no longer exist.")
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again"),
      401
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

exports.roomDecide = catchAsync(async (req, res, next) => {
  const booking = await Booking.findOne({
    tour: req.params.tourId,
    user: req.user.id,
  });
  if (!booking)
    return next(new AppError("You need to book this tour for access"));

  req.session.roomId =
    booking.tour.id.toString() + booking.startDate.toISOString();
  res.locals.booking = booking;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    if (!req.user.emailConfirm) {
      return next(
        new AppError("Your email is not confirmed to perfom this action"),
        403
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new AppError("There is no user with email address", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: "Token sent to email !",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending email. Try again later !"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired"), 400);
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!user) return next(new AppError("wrong id"), 404);

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("uncorrect password"), 404);
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
