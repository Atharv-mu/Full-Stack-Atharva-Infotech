const router = require("express").Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const { search = "", category = "", featured = "" } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: "Unable to load products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

function admin(req, res, next) {
  if (req.headers["x-admin-token"] !== process.env.ADMIN_TOKEN)
    return res.status(401).json({ message: "Unauthorized" });
  next();
}

router.post("/", admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put("/:id", admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete("/:id", admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

module.exports = router;
