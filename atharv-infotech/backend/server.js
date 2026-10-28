require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const productRoutes = require("./routes/products");
const enquiryRoutes = require("./routes/enquiries");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json({ limit: "100kb" }));

app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use("/api/products", productRoutes);
app.use("/api/enquiries", enquiryRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "Atharv Infotech API" }));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

async function start() {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing in .env");
    if (!process.env.ADMIN_TOKEN) throw new Error("ADMIN_TOKEN is missing in .env");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("Startup error:", err.message);
    process.exit(1);
  }
}

start();
