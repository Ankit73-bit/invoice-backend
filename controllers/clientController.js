import Client from "../models/clientModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllClients = catchAsync(async (req, res) => {
  const clients = await Client.find();

  res.status(200).json({
    status: "success",
    results: clients.length,
    data: {
      clients,
    },
  });
});

export const getClient = catchAsync(async (req, res) => {
  const client = await Client.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      client,
    },
  });
});

export const createClient = catchAsync(async (req, res) => {
  const newClient = await Client.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      client: newClient,
    },
  });
});

export const updateClient = catchAsync(async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      client,
    },
  });
});

export const deleteClient = catchAsync(async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
