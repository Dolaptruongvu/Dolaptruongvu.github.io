const express = require("express");
var morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const filmRoutes = require("./Routes/filmRoutes")
// app area
const app = express();

app.enable("trust proxy");

app.set("view engine", "pug");
app.set("View", path.join(__dirname, "View"));

//Body parser, reading data from body into rq.body

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// morgan use to read the log from middleware
app.use(morgan("common"));

// Test middleware

app.use((req, res, next) => {
  req.requestTimee = new Date().toISOString();

  next();
});

// Film routes

app.use("/api/v1/films",filmRoutes);


module.exports = { app };