const express = require("express");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const toursrouter = require(`./routes/toursRoutes`);
const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controllers/errorController");
const userRouter = require("./routes/usersRoutes");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const xss = require("xss-clean");
const helmet = require("helmet");
const reviewRouter = require("./routes/reviewsRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const viewRouter = require("./routes/viewRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const compression = require('compression')
const sessionMiddleware = session({
  secret: "changeit",
  resave: false,
  saveUninitialized: false,
});

// app area
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// Global MiddleWare
// Security HTTP headers
app.use(compression())

app.use(helmet());
app.use(cors({ origin: "*" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

app.use("/api", limiter);

//Body parser, reading data from body into rq.body

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      [
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "maxGroupSize",
        "difficulty",
        "price",
      ],
    ],
  })
);

//Serving static files

app.use(express.static(path.join(__dirname, "public")));

// Test middleware

app.use((req, res, next) => {
  req.requestTimee = new Date().toISOString();

  next();
});

// Route
app.use(sessionMiddleware);
app.use("/", viewRouter);
app.use("/api/v1/tours", toursrouter);
// User
app.use("/api/v1/users", userRouter);
// Reviews
app.use("/api/v1/reviews", reviewRouter);
// Booking
app.use("/api/v1/bookings", bookingRouter);

// app.use('/api/v1/users',usersrouter)
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl0} on this server!`, 404));
});

// Global middleware
app.use(globalErrorHandler);

module.exports = { app, sessionMiddleware };
