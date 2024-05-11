const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, "The bill need to have a price"],
  },
  book: {
    type: [mongoose.Schema.ObjectId],
    ref: "Book",
    required: [true, "bill must belong to a book."],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  haspaid: {
    type: Boolean,
    default: false,
  },
  ordered: {
    type: Boolean,
    default: true,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "Customer",
    required: [true, "Bill must belong to a customer"],
  },
  shipper: {
    type: mongoose.Schema.ObjectId,
    ref: "Customer",
    required: [true, "Bill must belong to a shipper"],
  },
});


billSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'customer',
    select: 'name address phoneNumber -_id'
  });
  this.populate({
    path: 'shipper',
    select: 'name phoneNumber -_id'
  });
  this.populate({
    path: 'book',
    select: 'title price -_id'
  });
  next()
  next()


});


const Bill = mongoose.model("Bill", billSchema);


module.exports = Bill;
