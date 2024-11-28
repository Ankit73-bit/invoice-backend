import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  financialYear: { type: String, required: true },
  company: { type: String, required: true },
  lastInvoiceNo: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;
