const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const errors = Object.values(err.keyValue).map((el) => el);
 
  const message = `Duplicate field value: ${errors.join(
    ", "
  )} . Please use another value`;


  return new AppError(message, 400);
};
const handleValidatonErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handleJsonWebTokenError = () =>
  new AppError("Invalid token. Please login again", 401);
const handleTokenExpiredError = () =>
  new AppError("Your token has expired! Please login again", 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    console.log("error", JSON.stringify(err));
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  console.log("error", JSON.stringify(err));
  return res.status(err.statusCode).render("error", {
    title: "Oops ! Something went wrong !",
    msg: err.message,
  });
};
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.log("error", JSON.stringify(err));

    return res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Oops ! Something went wrong !",
      msg: err.message,
    });
  }

  console.log("error", JSON.stringify(err));

  return res.status(err.statusCode).render("error", {
    title: "Something went wrong",
    msg: "Please try again later",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidatonErrorDB(err);
    if (err.name === "JsonWebTokenError") err = handleJsonWebTokenError();
    if (err.name === "TokenExpiredError") err = handleTokenExpiredError();

    sendErrorProd(err, req, res);
  }
};
