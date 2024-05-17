const Book = require("../Model/bookModel"); // Import the Book model
const Bill = require("../Model/billModel");
const { catchAsync } = require("../utils/catchAsync"); // Import catchAsync helper

exports.getOverview = catchAsync(async (req, res, next) => {
  const famousBooks = await Book.find({ ratings: { $gte: 4 } });
  const specialOffer = await Book.find({ price: { $lte: 10 } });
  console.log(specialOffer);
  res.status(200).render("index", {
    famousBooks, // Pass the books data to the template
    specialOffer,
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

// show filtered products
exports.filteredBooks = catchAsync(async (req, res, next) => {
  const { "sale-type": saleType, date, s } = req.query; // Get the category from query string
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
  console.log(s);
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

  if (!!s) {
    query = { ...query, title: { $regex: s } };
  }

  const books = await Book.find(query); // Find books matching the query

  res.status(200).render("book-filter", {
    listCategories,
    books,
    // filteredBooks,
  });
});
// exports.filteredBook = catchAsync(async (req, res, next) => {
//   const { category } = req.query; // Get the category from query string

//   let query = {};
//   if (category) {
//     const categories = category.split(','); // Split the category string into an array of categories
//     query = { category: { $in: categories } }; // Use $in to match any of the categories
//   }

//   const books = await Book.find(query); // Find books matching the query

//   res.status(200).render("book-filter",{
//     books
//   });
// });

// show shipping bills

exports.getShipBills = catchAsync(async (req, res, next) => {
  const bills = await Bill.find({ shipper: req.customer.id });

  res.status(200).render("", {
    bills,
  });
});

// show profile

exports.getProfile = catchAsync(async (req, res, next) => {
  const user = res.locals.customer;

  if (!user) {
    res.redirect("/login?r=/profile");
    return;
  }
  console.log(user);
  res.status(200).render("profile", {
    user,
  });
});

//Book Detail
exports.getBookDetail = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;             //fix to your logic
  const book = await Book.findById(bookId);  //fix to your logic
  res.status(200).render("login", {    //rendering
    book,                                   //fix to your logic
  });
});

//Cart
exports.getCart = catchAsync(async (req, res, next) => {
  const cartItems = req.session?.cart || []; //fix to your logic
  res.status(200).render("login", {           //rendering
    cartItems,                               //fix to your logic
  });
});

//getContracts
exports.getContracts = (req, res, next) => {
  res.status(200).render("login"); // Rendering
};
