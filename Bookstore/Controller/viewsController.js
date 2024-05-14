const Book = require("../Model/bookModel"); // Import the Book model
const Bill = require("../Model/billModel")
const { catchAsync } = require("../utils/catchAsync"); // Import catchAsync helper

exports.getOverview = catchAsync(async (req, res, next) => {
  
  const books = await Book.find();

  res.status(200).render("", { // render overview file
  });
});

//login  page
exports.getLogin = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

// // show filtered products
exports.filteredBooks = catchAsync(async (req, res, next) => {
  const { category } = req.query; // Get the category from query string

  let query = {};
  if (category) {
    const categories = category.split(','); // Split the category string into an array of categories
    query = { category: { $in: categories } }; // Use $in to match any of the categories
  }

  const books = await Book.find(query); // Find books matching the query

  res.status(200).render("",{
    filteredBooks
  })
});

// show shipping bills


exports.getShipBills = catchAsync(async (req, res, next) => {
    

  const bills = await Bill.find({shipper: req.customer.id})

  res.status(200).render("",{ // render shipping bill files
    bills
  })
  

});