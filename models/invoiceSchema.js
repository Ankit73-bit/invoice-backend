import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true }, // Unique identifier
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  }, // References the client
  items: [
    {
      description: { type: String, required: true }, // Item name or description
      quantity: { type: Number, required: true, min: 1 }, // Number of units
      price: { type: Number, required: true, min: 0 }, // Price per unit
    },
  ],
  totalAmount: { type: Number, required: true }, // Calculated total
  tax: { type: Number, default: 0 }, // Optional tax amount
  discount: { type: Number, default: 0 }, // Optional discount amount
  dueDate: { type: Date, required: true }, // Payment due date
  status: {
    type: String,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now }, // Timestamp of creation
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
