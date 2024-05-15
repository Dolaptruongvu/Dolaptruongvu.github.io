const Book = require("../Model/bookModel"); // Import the Book model
const Bill = require("../Model/billModel");
const { catchAsync } = require("../utils/catchAsync"); // Import catchAsync helper

exports.getOverview = catchAsync(async (req, res, next) => {
  // const books = await Book.find();

  // const sort = req.query.sort ? { [req.query.sort]: 1 } : { _id: 1 }; // Simple sorting
  // // Ensure the base image path is defined and accessible from the template

  // const books = await Book.find(filter).sort(sort);

  res.status(200).render("index", {
    // books, // Pass the books data to the template
  });
});

//login  page
exports.getLogin = catchAsync(async (req, res, next) => {
  if (res.locals?.customer) {
    res.redirect("/");
    return;
  }
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

//signup  page
exports.getSignup = catchAsync(async (req, res, next) => {
  if (res.locals?.customer) {
    res.redirect("/");
    return;
  }
  res.status(200).render("signup", {});
});

// // show filtered products
exports.filteredBooks = catchAsync(async (req, res, next) => {
  const { "sale-type": saleType, date } = req.query; // Get the category from query string
  const listCategories = [
    "Action",
    "Fantasy",
    "Adventure",
    "History",
    "Animation",
    "Horror",
    "Biography",
    "Mystery",
    "Comedy",
    "Romance",
    "Crime",
    "Sci-fi",
  ];

  const categoriesQuery = Object.entries(req.query)
    .filter((item) => item[0].search("categories-") > -1)
    .map((item) => item[1]); /// [[key, value],...]

  let query = {};

  // category
  if (categoriesQuery.length > 0) {
    query = { category: { $in: categoriesQuery } }; // Use $in to match any of the categories
  }
  // date

  if (date) {
    query = {
      ...query,
      releaseDate: new Date(date),
    };
  }

  const books = await Book.find(query); // Find books matching the query

  res.status(200).render("book-filter", {
    listCategories,
    books,
    // filteredBooks,
  });
});

// show shipping bills

exports.getShipBills = catchAsync(async (req, res, next) => {
  const bills = await Bill.find({ shipper: req.customer.id });

  res.status(200).render("", {
    bills,
  });
});

// show shipping bills

exports.getProfile = catchAsync(async (req, res, next) => {
  res.status(200).render("profile", {});
});
