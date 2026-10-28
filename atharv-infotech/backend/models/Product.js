const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ["Printers","Monitors","Computers","Accessories","Storage","Networking"] },
  brand: { type: String, trim: true },
  price: { type: Number, min: 0 },
  description: { type: String, trim: true },
  image: { type: String, default: "" },
  stock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
