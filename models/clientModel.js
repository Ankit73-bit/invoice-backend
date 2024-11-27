import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  clientCompanyName: { type: String, required: true, trim: true },
  company: {
    type: String,
    enum: ["Paras Solutions", "Paras Print"],
    required: true,
  },
  clientName: { type: String },
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
  createdAt: { type: Date, default: Date.now },
});

const Customer = mongoose.model("Client", clientSchema);
export default Customer;
