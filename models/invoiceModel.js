import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    required: [true, "A Invoice must have invoice number"],
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, "A Invoice must have invoice date"],
  },
  financialYear: { type: String, required: true }, // e.g., "24-25"
  referenceNo: { type: String },
  referenceDate: { type: Date },
  otherReferences: { type: String },
  buyersPO: { type: String },
  buyersPODate: { type: Date },
  dispatchDetails: {
    docNo: { type: String },
    date: { type: Date },
    through: { type: String },
    destination: { type: String },
  },
  company: {
    type: String,
    enum: ["Paras Solutions", "Paras Print"],
    required: [true, "A Invoice must have company"],
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  consignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consignee",
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: [true, "A Invoice must have client"],
  },
  companyBankDetails: {
    type: String,
    required: [true, "A Invoice must have company details"],
  },
  items: [
    {
      description: { type: String, required: true, trim: true },
      hsnCode: { type: String },
      unitPrice: { type: Number, min: 0 },
      quantity: { type: Number, min: 0 },
      total: { type: Number, min: 0 },
    },
  ],
  totalBeforeGST: { type: Number, required: true },
  gstDetails: {
    type: {
      type: String,
      enum: ["CGST", "SGST", "IGST", "None"],
      default: "None",
    },
    cgstRate: { type: Number },
    sgstRate: { type: Number },
    igstRate: { type: Number },
    cgst: { type: Number },
    sgst: { type: Number },
    igst: { type: Number },
    totalAmount: { type: Number },
  },
  fuelSurcharge: {
    rate: { type: Number, default: 10 },
    amount: { type: Number, default: 0 },
  },
  roundingOff: { type: Number, default: 0.0 },
  grossAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Add compound index for unique invoiceNo per company
invoiceSchema.index(
  { invoiceNo: 1, financialYear: 1, company: 1 },
  { unique: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
