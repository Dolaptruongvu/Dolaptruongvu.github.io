const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");


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
   

    const doc = await Model.find();
   

    res.status(200).json({
      status: "sucess",
      result: doc.length,
      timeAtRequest: req.requestTimee,
      data: doc,
    });
  });
