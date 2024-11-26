import Consignee from "../models/consigneeModel.js";
import Client from "../models/clientModel.js";
import Invoice from "../models/invoiceModel.js";
import mongoose from "mongoose";

export const getAllInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagination params
    const invoices = await Invoice.find()
      .select("-__v") // Exclude fields like `__v`
      .skip((page - 1) * limit)
      .limit(Number(limit));

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

export const getLastInvoice = async (req, res) => {
  try {
    const lastInvoice = await Invoice.findOne().sort({ invoiceNo: -1 });

    if (!lastInvoice) {
      return res
        .status(404)
        .json({ success: false, message: "No invoices found" });
    }

    res.status(200).json({ success: true, data: lastInvoice });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
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

    // Parse Date fields
    const parsedInvoice = {
      ...invoiceData,
      date: invoiceData.date ? new Date(invoiceData.date) : undefined,
      referenceDate: invoiceData.referenceDate
        ? new Date(invoiceData.referenceDate)
        : undefined,
      buyersPODate: invoiceData.buyersPODate
        ? new Date(invoiceData.buyersPODate)
        : undefined,
      dispatchDocLRNoDate: invoiceData.dispatchDocLRNoDate
        ? new Date(invoiceData.dispatchDocLRNoDate)
        : undefined,
    };

    // Create Invoice
    const newInvoice = await Invoice.create({
      ...parsedInvoice,
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
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res
        .status(404)
        .json({ status: "fail", message: "Invoice not found" });
    }

    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Error deleting invoice",
      error: err.message,
    });
  }
};
