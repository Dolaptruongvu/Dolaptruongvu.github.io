const mongoose = require("mongoose");
const Tour = require("./tourModels");

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "Booking must belong to a Tour !"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a Tour !"],
  },
  price: {
    type: Number,
    required: [true, "Booking must have a price !"],
  },
  startDate: {
    type: Date,
    required: [true, "Booking must have a startDate"],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.statics.updateParticipants = async function (tourId, date) {
  if (tourId && date) {
    const tour = await Tour.findOneAndUpdate(
      { _id: tourId, "startDates.dates": date },
      { $inc: { "startDates.$.participants": 1 } }
    );
  }
};

bookingSchema.post("save", function () {
  this.constructor.updateParticipants(this.tour, this.startDate);
  console.log(this.tour, this.startDate);
});

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
  next();
});

const Booking = new mongoose.model("Booking", bookingSchema);

module.exports = Booking;
