const clientSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Client's name
  email: { type: String, required: true, unique: true }, // Email address
  phone: { type: String }, // Optional phone number
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  createdAt: { type: Date, default: Date.now }, // Timestamp of creation
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
