// const multer = require("multer");
// const sharp = require("sharp");
const Customer = require("../Model/customerModel");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image! please upload only images.", 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// exports.uploadUserPhoto = upload.single("photo");

// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toFile(`basicrouting/public/img/userphoto/${req.file.filename}`);

//   next();
// });

// const filteredObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };
exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const customers = await Customer.find();

  res.status(200).json({
    status: "sucess",
    result: customers.length,
    timeAtRequest: req.requestTimee,
    data: customers,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword"
      ),
      400
    );
  }

  const filteredBody = filteredObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Customer.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.deleteCustomer = factory.deleteOne(Customer);

exports.updatedCustomer = factory.updateOne(Customer);

exports.getCustomer = factory.getOne(Customer);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.createCustomer = factory.createOne(Customer);

// shipper

exports.setShipperId = catchAsync(async (req, res, next) => {
  // randomly choose shipper for the bill
  const shippers = await Customer.find({
    // find shipper have numb of order less than 5
    role: "shipper",
    numbOfOrder: { $lt: 100 },
  });
  if (!shippers.length) {
    return next(new AppError("No available shippers found.", 403));
  }
  const shipper = await Customer.findByIdAndUpdate(
    shippers[0].id,
    { $inc: { numbOfOrder: 1 } },
    { new: true }
  ); // update numb of order in shipper
  req.body.shipper = shipper.id;
  console.log(shipper);
  next();
});

// for admin
exports.setRoles = catchAsync(async (req, res, next) => {
  let customerPhoneNumber = parseInt(req.body.phoneNumber);
  console.log(typeof customerPhoneNumber);

  const customer = await Customer.findOneAndUpdate(
    { phoneNumber: customerPhoneNumber },
    { role: req.body.role },
    { new: true }
  );
  console.log(customer);
  if (!customer) {
    next(new AppError("Cannot find customer", 403));
  }

  res.status(200).json({
    status: "success",
    data: customer,
  });
});
