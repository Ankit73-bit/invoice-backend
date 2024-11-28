import Consignee from "../models/consigneeModel.js";
import Client from "../models/clientModel.js";
import Invoice from "../models/invoiceModel.js";
import mongoose from "mongoose";
import APIFeatures from "../utils/apiFeatures.js";
import Counter from "../models/counterModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getAllInvoices = catchAsync(async (req, res, next) => {
  // execute QUERY
  const features = new APIFeatures(Invoice.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const invoices = await features.query;

  res.status(200).json({
    status: "success",
    results: invoices.length,
    data: invoices,
  });
});

export const getInvoice = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError(`Invalid invoice ID: ${id}`, 400));
  }

  const invoice = await Invoice.findById(id)
    .populate("consignee", "name address") // Select specific fields
    .populate("client", "name email");

  if (!invoice) {
    return next(new AppError("Invoice not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: invoice,
  });
});

function getFinancialYear(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed (0 = January)
  const startYear = month < 3 ? year - 1 : year; // Financial year starts in April
  const endYear = startYear + 1;
  return `${startYear.toString()}-${endYear.toString().slice(-2)}`;
}

async function getNextInvoiceNo(company, financialYear) {
  // Get the company prefix
  const prefix = company === "Paras Print" ? "PP" : "PS";

  // Fetch the counter for the given financial year and company
  const counter = await Counter.findOneAndUpdate(
    { company, financialYear },
    { $inc: { lastInvoiceNo: 1 } }, // Increment the counter
    { new: true, upsert: true } // Create the document if it doesn't exist
  );

  // Invoice number in the format: "PP-109/2024-25"
  const invoiceNo = `${prefix}-${counter.lastInvoiceNo}/${financialYear}`;

  return invoiceNo;
}

export const createInvoice = catchAsync(async (req, res, next) => {
  const { client, consignee, items, ...invoiceData } = req.body;

  // Validate required fields
  if (
    !invoiceData.company ||
    !client ||
    !consignee ||
    !items ||
    items.length === 0
  ) {
    return next(
      new AppError(
        "Missing required fields: company, client, consignee, or items.",
        400
      )
    );
  }

  // Determine financial year and next invoice number
  const financialYear = getFinancialYear();
  const nextInvoiceNo = await getNextInvoiceNo(
    invoiceData.company,
    financialYear
  );

  // Validate `Client` and `Consignee`
  const [clientDoc, consigneeDoc] = await Promise.all([
    Client.findById(client),
    Consignee.findById(consignee),
  ]);

  if (!clientDoc) {
    return next(new AppError("Client not found", 404));
  }

  if (!consigneeDoc) {
    return next(new AppError("Consignee not found", 404));
  }

  // Create the invoice
  const newInvoice = await Invoice.create({
    ...invoiceData,
    invoiceNo: nextInvoiceNo,
    financialYear,
    client,
    consignee,
    items,
  });

  res.status(201).json({
    status: "success",
    data: { invoice: newInvoice },
  });
});

export const updateInvoice = catchAsync(async (req, res, next) => {
  const updatedInvoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedInvoice) {
    return next(new AppError("Invoice not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { invoice: updatedInvoice },
  });
});

export const deleteInvoice = catchAsync(async (req, res, next) => {
  await Invoice.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getInvoicesStats = catchAsync(async (req, res, next) => {
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
});
