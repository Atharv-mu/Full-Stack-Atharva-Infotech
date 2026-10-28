const router = require("express").Router();
const Enquiry = require("../models/Enquiry");

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, product, message } = req.body;
    if (!name || !phone || !message)
      return res.status(400).json({ message: "Name, phone and message are required" });

    const enquiry = await Enquiry.create({ name, phone, email, product, message });
    res.status(201).json({ message: "Enquiry submitted successfully", id: enquiry._id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

function admin(req, res, next) {
  if (req.headers["x-admin-token"] !== process.env.ADMIN_TOKEN)
    return res.status(401).json({ message: "Unauthorized" });
  next();
}

router.get("/", admin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch {
    res.status(500).json({ message: "Unable to load enquiries" });
  }
});

router.patch("/:id", admin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch {
    res.status(400).json({ message: "Invalid enquiry ID" });
  }
});

router.delete("/:id", admin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ message: "Enquiry deleted" });
  } catch {
    res.status(400).json({ message: "Invalid enquiry ID" });
  }
});

module.exports = router;
