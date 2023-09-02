const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apifeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError(`No document found with that id`, 404));
    }

    res.status(204).json({
      status: "sucess",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError(`No document found with that id`, 404));
    }
    res.status(200).json({
      status: "sucess",
      doc,
    });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError(`No doc found with that id`, 404));
    }
    res.status(200).json({
      status: "sucess",
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    } else if (req.params.userId) {
      filter = { user: req.params.userId };
    }

    const feature = new APIFeatures(Model.find(filter), req.query);
    feature.filter().sort().limit().paginate();
    const doc = await feature.query;

    res.status(200).json({
      status: "sucess",
      result: doc.length,
      timeAtRequest: req.requestTimee,
      data: doc,
    });
  });
