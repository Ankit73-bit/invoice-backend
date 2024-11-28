import Consignee from "../models/consigneeModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllConsingees = catchAsync(async (req, res) => {
  const consignees = await Consignee.find();

  res.status(200).json({
    status: "success",
    results: consignees.length,
    data: {
      consignees,
    },
  });
});

export const getConsingee = catchAsync(async (req, res) => {
  const consignee = await Consignee.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      consignee,
    },
  });
});

export const createConsingee = catchAsync(async (req, res) => {
  const newConsignee = await Consignee.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      consignee: newConsignee,
    },
  });
});

export const updateConsingee = catchAsync(async (req, res) => {
  const consignee = await Consignee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      consignee,
    },
  });
});

export const deleteConsingee = catchAsync(async (req, res) => {
  await Consignee.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
