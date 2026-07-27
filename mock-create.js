require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const { createProduct } = require('./controllers/productController');

const req = {
  body: {
    name: "Skyler",
    description: "Experience the pinnacle of display excellence with our premium product. Indulge in the finest flavors, carefully crafted for those who appreciate the art of exceptional taste. Our premium product showcases a blend of quality, innovation, and tradition, offering a true experience.",
    image: "", // Empty string to simulate what the form sends if image is not selected (wait, in the screenshot they uploaded an image "skyler.webp", but we'll try empty first, and we'll try with a simulated image ID)
    category: "Display Cabinets",
    subcategory: "Confectionery / Patisserie",
    brands: "Continuous Display Mastery",
    sku: "",
    material: "",
    warranty: "1 Year Manufacturer Warranty",
    applications: "Pharmaceutical Industry, Biotechnology Labs, Hospital",
    features: "display area, making it suitable for desserts, pastries, chocolates, sandwiches, and other chilled food products.",
    specifications: "This premium refrigerated display counter is engineered for high-performance food presentation while maintaining optimal freshness and hygiene. Constructed with a durable stainless steel frame and a premium marble-finish front panel, it combines modern aesthetics with long-lasting durability.",
    tabs: [
      {
        name: "New Section",
        title: "Lighting",
        description: "Electronic digital controller of William make is used for precise control and display of the temperature of the food items.",
        image: "",
        features: []
      }
    ]
  }
};

const res = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log("Response Code:", this.statusCode || 200);
    console.log("Response Data:", JSON.stringify(data, null, 2));
    process.exit(0);
  }
};

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("Connected to MongoDB, running controller mock...");
  try {
    await createProduct(req, res);
  } catch (err) {
    console.error("Caught unexpected error:", err);
    process.exit(1);
  }
});
