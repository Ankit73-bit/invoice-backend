import Customer from "../models/clientModel.js";

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();

    res.status(200).json({
      status: "success",
      results: customers.length,
      data: {
        customers,
      },
    });
  } catch (err) {
    res.status(404).json({
      staus: "fail",
      message: err,
    });
  }
};

export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        customer,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        customer: newCustomer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        customer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
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
