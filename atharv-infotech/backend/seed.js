require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  { name:"HP LaserJet Pro Printer", category:"Printers", brand:"HP", price:15999, description:"Fast monochrome laser printer for home and office use.", featured:true },
  { name:"Canon PIXMA Multifunction Printer", category:"Printers", brand:"Canon", price:12999, description:"Print, scan and copy in one compact machine.", featured:true },
  { name:"24-inch Full HD Monitor", category:"Monitors", brand:"Acer", price:8999, description:"Full HD display suitable for work, study and everyday use.", featured:true },
  { name:"27-inch IPS Monitor", category:"Monitors", brand:"LG", price:14999, description:"Sharp IPS display with wide viewing angles.", featured:true },
  { name:"Business Desktop PC", category:"Computers", brand:"Dell", price:38999, description:"Reliable desktop configuration for office productivity.", featured:true },
  { name:"Wireless Keyboard & Mouse", category:"Accessories", brand:"Logitech", price:1699, description:"Comfortable wireless keyboard and mouse combo." },
  { name:"500GB NVMe SSD", category:"Storage", brand:"WD", price:3999, description:"Fast solid-state storage for desktops and laptops." },
  { name:"Dual Band Wi-Fi Router", category:"Networking", brand:"TP-Link", price:2199, description:"Reliable dual-band Wi-Fi for home and office networks." }
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
  await mongoose.disconnect();
})();
