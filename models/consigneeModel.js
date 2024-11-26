import mongoose from "mongoose";

const consigneeSchema = new mongoose.Schema({
  clientConsigneeName: { type: String, required: true, trim: true },
  company: {
    type: String,
    enum: ["Paras Solutions", "Paras Print"],
    required: true,
  },
  ConsigneeName: { type: String },
  address: {
    add1: { type: String },
    add2: { type: String },
    add3: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
    country: { type: String, default: "India" },
    panNo: { type: String },
    gstNo: { type: String },
    stateCode: { type: String },
  },
  contact: { type: String },
  email: { type: String },
});

const Consignee = mongoose.model("Consignee", consigneeSchema);
export default Consignee;
