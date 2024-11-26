import Consignee from "../models/consigneeModel.js";

export const getAllConsingees = async (req, res) => {
  try {
    const consignees = await Consignee.find();

    res.status(200).json({
      status: "success",
      results: consignees.length,
      data: {
        consignees,
      },
    });
  } catch (err) {
    res.status(404).json({
      staus: "fail",
      message: err,
    });
  }
};

export const getConsingee = async (req, res) => {
  try {
    const consignee = await Consignee.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        consignee,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export const createConsingee = async (req, res) => {
  try {
    const newConsignee = await Consignee.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        consignee: newConsignee,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const updateConsingee = async (req, res) => {
  try {
    const consignee = await Consignee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        consignee,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteConsingee = async (req, res) => {
  try {
    await Consignee.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
