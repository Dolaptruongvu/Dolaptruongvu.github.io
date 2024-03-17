const mongoose = require("mongoose");
const slugify = require("slugify");

const filmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "must have a name"],
    unique: [true, "must be unique"],
    trim: true,
    maxlength: [40, "A film name must have less or equal than 40 characters"],
    minlength: [2, "A film name must have more or equal than 2 characters"],
  },
  slug: String,
  director: {
    type: String,
    required: [true, "must have a name of director"],
    trim: true,
  },
  genere: {
    type: String,
    required: [true, "must have a genere"],
    maxlength: [40, "A film name must have less or equal than 40 characters"],
    minlength: [4, "A film name must have more or equal than 4 characters"],
  },
  premiere: {
    type: Date,
    require: [true, "A film must has a date"],
  },
  duration: {
    type: Number,
    required: [true, "A film must have a duration"],
  },
  language: {
    type: String,
    required: [true, "A film must have a difficulty "],
    enum: {
        values: ["Vietnamese", "English", "Korean","Japanese","Chinese"],
        message: "Difficulty is  either: Vietnamese, English, Korean, Japanese, Chinese",
      },
  },
  description: {
    type: String,
    trim: true,
    required: [true, "A film must have a description"],
  },
  price: {
    type: Number,
    required: [true, "must have price"],
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
    set: (val) => Math.round(val * 10) / 10,
  },
  images: [String],
  trailer: [String],
  
});


const Film = mongoose.model("Film", filmSchema);

module.exports = Film;