import Consignee from "../models/consigneeModel.js";
import Client from "../models/clientModel.js";
import Invoice from "../models/invoiceModel.js";
import Item from "../models/itemsModel.js";

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();

    res.status(200).json({
      status: "success",
      results: invoices.length,
      data: {
        invoices,
      },
    });
  } catch (err) {
    res.status(404).json({
      staus: "fail",
      message: err,
    });
  }
};

export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("consignee")
      .populate("client");

    if (!invoice) {
      return res.status(404).json({
        status: "fail",
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        invoice,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message || "Error retrieving invoice",
    });
  }
};

export const getLastInvoice = async (req, res) => {
  try {
    // Fetch all invoices
    const invoices = await Invoice.find();

    if (invoices.length === 0) {
      return res
        .status(200)
        .json({ success: true, data: null, message: "No invoices found" });
    }

    // Extract the numeric part of the invoice number and sort
    const sortedInvoices = invoices.sort((a, b) => {
      const invoiceNumberA = parseInt(a.invoiceNo.split("-")[1]);
      const invoiceNumberB = parseInt(b.invoiceNo.split("-")[1]);
      return invoiceNumberB - invoiceNumberA;
    });

    // Get the last (highest) invoice number
    const lastInvoice = sortedInvoices[0];

    res.status(200).json({ success: true, data: lastInvoice });
  } catch (error) {
    console.error("Error fetching the last invoice:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createInvoice = async (req, res) => {
  try {
    // Check if items is an array
    if (!Array.isArray(req.body.items)) {
      return res.status(400).json({
        status: "fail",
        message: "Items must be an array",
      });
    }

    // Fetch customer and items details
    const client = await Client.findById(req.body.client);
    if (!client) {
      return res
        .status(404)
        .json({ status: "fail", message: "Client not found!" });
    }

    // Fetch consignee
    const consignee = await Consignee.findById(req.body.consignee);
    if (!consignee) {
      return res
        .status(404)
        .json({ status: "fail", message: "Consignee not found!" });
    }

    const items = await Item.find({ _id: { $in: req.body.items } });
    if (items.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Items not found!" });
    }

    // Create the invoice
    const newInvoice = await Invoice.create({
      invoiceNo: req.body.invoiceNo,
      date: req.body.date, // Use converted date
      referenceNo: req.body.referenceNo || "", // Ensure referenceNo is not null
      referenceDate: req.body.referenceDate, // Use converted date
      otherReferences: req.body.otherReferences, // Use converted date
      buyersPO: req.body.buyersPO,
      buyersPODate: req.body.buyersPODate, // Use converted date
      dispatchDocLRNo: req.body.dispatchDocLRNo,
      dispatchDocLRNoDate: req.body.dispatchDocLRNoDate, // Use converted date
      dispatchedThrough: req.body.dispatchedThrough,
      dispatchedDestination: req.body.dispatchedDestination,
      company: req.body.company,
      from: req.body.company || req.body.from,
      to: customer.clientCompanyName,
      consignee: req.body.consignee,
      customer: req.body.customer,
      companyBankDetails: req.body.companyBankDetails,
      items: req.body.items,
      totalBeforeGST: req.body.totalBeforeGST,
      gstType: req.body.gstType,
      gstRate: req.body.gstRate,
      cgst: req.body.cgst,
      sgst: req.body.sgst,
      igst: req.body.igst,
      cgstAmount: req.body.cgstAmount,
      sgstAmount: req.body.sgstAmount,
      igstAmount: req.body.igstAmount,
      fuelSurchargeAmount: req.body.fuelSurchargeAmount,
      totalGST: req.body.totalGST,
      fuelSurcharge: req.body.fuelSurcharge,
      totalAmount: req.body.totalAmount,
      roundingOff: req.body.roundingOff,
      grossAmount: req.body.grossAmount,
      amountInWords: req.body.amountInWords,
    });

    // Send success response
    res.status(201).json({ status: "success", data: { invoice: newInvoice } });
  } catch (err) {
    console.error("Error creating invoice:", err);
    res.status(400).json({
      status: "fail",
      message: err.message || "Error creating invoice",
    });
  }
};

export const updateInovice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        invoice,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
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
