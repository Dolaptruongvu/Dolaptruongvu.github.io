const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, "The bill need to have a price"],
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: "Book",
    required: [true, "bill must belong to a book."],
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

