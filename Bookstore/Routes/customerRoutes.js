const express = require("express");
const fs = require("fs");
// const authController = require("../Controllers/authController");
const customerController = require("../Controller/customerController");
// const viewsController = require("../Controllers/viewsController");
// const bookingRouter = require("./bookingRoutes");

const router = express.Router();


router
  .route("/")
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer);

router
  .route("/:id")
  .get(customerController.getCustomer)
  .delete(customerController.deleteCustomer)
  .patch(customerController.updatedCustomer);

module.exports = router;