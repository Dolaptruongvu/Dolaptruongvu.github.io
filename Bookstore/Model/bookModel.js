const mongoose = require("mongoose");
const slugify = require("slugify");


const bookSchema = new mongoose.Schema({
  slug: String,
  // Title of the book
  title: {
    type: String,
    required: [true, "Book title is required"],
    trim: true,
    maxlength: [100, "Book title cannot exceed 100 characters"],
  },
  // Array of image name
  images: [String],
  // Author(s)
  author: {
    type: String,
    required: [true, "Author name is required"],
    trim: true,
  },
  // Category (e.g. Fiction, Non-Fiction, etc.)
  category: {
    type: [String],
    required: [true, "Category is required"],
    trim: true,
  },
  // Language (e.g. Vietnamese, English, etc.)
  language: {
    type: String,
    required: [true, "Language is required"],
    trim: true,
  },
  // Translator (if applicable)
  translator: {
    type: String,
    trim: true,
  },
  // Total number of pages
  totalPages: {
    type: Number,
    required: [true, "Total pages are required"],
  },
  // Release date
  releaseDate: {
    type: Date,
    required: [true, "Release date is required"],
  },
  // Publishing company
  publisher: {
    type: String,
    required: [true, "Publisher is required"],
    trim: true,
  },
  // Book cover type (Hardcover, Paperback, etc.)
  coverType: {
    type: String,
    trim: true,
  },
  // Weight (in grams)
  weight: {
    type: Number,
  },
  // Quantity of books in stock
  quantity: {
    type: Number,
    default: 0,  // Default to 0 if not specified
  },
  // Book summary/description
  summary: {
    type: String,
    trim: true,
    required: [true, "Summary is required"],
  },
  // Ratings (average score)
  ratings: {
    type: Number,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
  },
  // Price 
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
});


const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
