import Consignee from "../models/consigneeModel.js";
import Client from "../models/clientModel.js";
import Invoice from "../models/invoiceModel.js";
import mongoose from "mongoose";
import APIFeatures from "../utils/apiFeatures.js";

export const getAllInvoices = async (req, res) => {
  try {
    // execute QUERY
    const features = new APIFeatures(Invoice.find(), req.query)
      .filter()
      .sort()
      .limitField()
      .paginate();
    const invoices = await features.query;

    res.status(200).json({
      status: "success",
      results: invoices.length,
      data: invoices,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Failed to fetch invoices",
      error: err.message,
    });
  }
};

export const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid Invoice ID" });
    }

    const invoice = await Invoice.findById(id)
      .populate("consignee", "name address") // Select specific fields
      .populate("client", "name email");

    if (!invoice) {
      return res.status(404).json({
        status: "fail",
        message: "Invoice not found",
      });
    }

    res.status(200).json({ status: "success", data: invoice });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error fetching invoice",
      error: err.message,
    });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { client, consignee, items, ...invoiceData } = req.body;

    // Validate `Client`
    const clientDoc = await Client.findById(client);
    if (!clientDoc) {
      return res
        .status(404)
        .json({ status: "fail", message: "Client not found" });
    }

    // Validate `Consignee`
    const consigneeDoc = await Consignee.findById(consignee);
    if (!consigneeDoc) {
      return res
        .status(404)
        .json({ status: "fail", message: "Consignee not found" });
    }

    // Create Invoice
    const newInvoice = await Invoice.create({
      ...invoiceData,
      client,
      consignee,
      items,
    });

    res.status(201).json({ status: "success", data: { invoice: newInvoice } });
  } catch (err) {
    console.error("Error creating invoice:", err);
    res.status(400).json({
      status: "fail",
      message: "Error creating invoice",
      error: err.message,
    });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedInvoice) {
      return res
        .status(404)
        .json({ status: "fail", message: "Invoice not found" });
    }

    res
      .status(200)
      .json({ status: "success", data: { invoice: updatedInvoice } });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Error updating invoice",
      error: err.message,
    });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Error deleting invoice",
      error: err.message,
    });
  }
};

export const getInvoicesStats = async (req, res) => {
  try {
    const stats = await Invoice.aggregate([
      {
        $facet: {
          totalRevenue: [
            { $group: { _id: "$company", total: { $sum: "$grossAmount" } } },
          ],
          revenueByStatus: [
            { $group: { _id: "$status", total: { $sum: "$grossAmount" } } },
          ],
          monthlyTrends: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                total: { $sum: "$grossAmount" },
              },
            },
            { $sort: { _id: 1 } },
          ],
          countByStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          averageGSTRate: [
            {
              $group: {
                _id: null,
                averageGSTRate: { $avg: "$gstDetails.rate" },
              },
            },
          ],
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: stats[0],
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
