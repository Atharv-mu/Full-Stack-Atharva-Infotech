const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  email: { type: String, trim: true, lowercase: true, maxlength: 150 },
  product: { type: String, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, enum: ["new","contacted","closed"], default: "new" }
}, { timestamps: true });

module.exports = mongoose.model("Enquiry", enquirySchema);
