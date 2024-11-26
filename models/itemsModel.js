import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  hsnCode: { type: String },
  unitPrice: { type: String },
  quantity: { type: String },
  total: { type: String },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
