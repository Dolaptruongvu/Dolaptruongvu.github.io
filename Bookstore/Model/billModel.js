const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, "The bill need to have a price"],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  haspaid: {
    type: Boolean,
    default: false
  }
});

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;

