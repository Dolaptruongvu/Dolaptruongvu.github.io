const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { app } = require("./app");
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port : ${port}`);
});
dotenv.config({ path: `./config.env` });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("Error to connect database");
    console.log(err);
  });

// console.log(process.env);
console.log(app.get("env"));

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!, shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
