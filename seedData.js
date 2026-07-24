require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categoriesData = [
  {
    id: "williams-display",
    name: "Williams Display Counters",
    description: "Premium refrigerated display counters for bakeries, sweet shops, cafes, and retail environments, featuring precision cooling and high-visibility designs.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Williams Refrigerated Display Counters | BCR Innovations",
    seoDescription: "Explore our range of Williams display counters and refrigerated cabinets for optimal product presentation."
  },
  {
    id: "sln-kitchen",
    name: "SLN Kitchen Equipment",
    description: "Heavy-duty commercial kitchen equipment fabricated from food-grade stainless steel for restaurants, hotels, and cloud kitchens.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&w=800&q=80",
    seoTitle: "SLN Commercial Kitchen Equipment | SS 304 Fabrication",
    seoDescription: "High-quality stainless steel kitchen equipment by SLN including cooking ranges, preparation tables, and utility storage."
  },
  {
    id: "sml-cleanroom",
    name: "SML Clean Room Equipment",
    description: "Specialized infrastructure and contamination-control equipment for pharmaceutical, biotechnology, and healthcare cleanrooms.",
    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=800&q=80",
    seoTitle: "SML Clean Room Solutions | HVAC & Modular Panels",
    seoDescription: "Turnkey cleanroom infrastructure from SML including modular panels, AHU systems, and laminar air flow units."
  },
  {
    id: "geebee-bakery",
    name: "Gee Bee Bakery Equipment",
    description: "Industrial-grade bakery machinery including rotary rack ovens, planetary mixers, and dough dividers for commercial bakeries.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    seoTitle: "Gee Bee Bakery Machinery | Ovens & Mixers",
    seoDescription: "Commercial bakery equipment by Gee Bee Industrial Products. High-capacity ovens, dough mixers, and slicing machines."
  }
];

const productsData = [
  // Williams
  {
    name: "Williams Confectionery Display Cabinet",
    category: "williams-display",
    brands: "Williams Refrigeration",
    sku: "W-CONF-001",
    price: "Contact for Price",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    description: "A specialized display cabinet featuring ultra-clear heated glass, warm LED lighting, and precise temperature control, perfect for showcasing cakes and pastries while preventing condensation.",
    features: ["Ultra-clear heated glass", "Warm LED lighting", "CoolSmart Controller", "High-density polyurethane insulation"],
    specifications: "Temperature Range: +2°C to +8°C\nPower Supply: 230V/50Hz/1Ph\nRefrigerant: R290 / R134a",
    material: "Food-safe stainless steel & Heated Glass",
    size: "1200mm x 750mm x 1350mm (Customizable)",
    capacity: "4 Display Shelves",
    warranty: "1 Year Comprehensive",
    applications: "Bakeries, Patisseries, Cafes, High-end Retail"
  },
  {
    name: "Williams Deli Serve Over Counter",
    category: "williams-display",
    brands: "Williams Refrigeration",
    sku: "W-DELI-002",
    price: "Contact for Price",
    image: "https://plus.unsplash.com/premium_photo-1661603517409-b69018eaf396?auto=format&fit=crop&w=800&q=80",
    description: "Designed specifically for delicatessen items and general retail display. Features curved front glass and rear sliding doors for easy access.",
    features: ["Curved anti-fog display glass", "Rear sliding access doors", "Under-counter storage", "Digital temperature display"],
    specifications: "Ambient Operating Temp: Up to 43°C\nCooling System: Ventilated",
    material: "Stainless Steel 304 Interior",
    size: "1500mm x 900mm x 1200mm",
    capacity: "300 Liters",
    warranty: "1 Year Comprehensive",
    applications: "Delicatessens, Supermarkets, Sweet Shops"
  },

  // SLN
  {
    name: "SLN 4-Burner Commercial Gas Range",
    category: "sln-kitchen",
    brands: "SLN Equipments",
    sku: "SLN-4B-01",
    price: "Contact for Quote",
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f101f13?auto=format&fit=crop&w=800&q=80",
    description: "Heavy-duty 4-burner commercial gas cooking range built from robust stainless steel, perfect for high-volume restaurant kitchens.",
    features: ["High-pressure burners", "Removable drip trays", "Heavy-duty cast iron pan supports", "Adjustable bullet feet"],
    specifications: "Burner Rating: 4 x 30,000 BTU\nGas Type: LPG/PNG compatible\nIgnition: Manual",
    material: "SS 304 Grade (16 Gauge Top, 18 Gauge Body)",
    size: "36\" x 30\" x 34\" (L x W x H)",
    capacity: "4 simultaneous cooking stations",
    warranty: "2 Years on Body, 1 Year on Burners",
    applications: "Restaurants, Hotels, Cloud Kitchens, Canteens"
  },
  {
    name: "SLN Stainless Steel Work Table with Undershelf",
    category: "sln-kitchen",
    brands: "SLN Equipments",
    sku: "SLN-WT-02",
    price: "Contact for Quote",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    description: "Sturdy preparation counter essential for any commercial kitchen. Features a reinforced top for heavy prep work and a lower shelf for storage.",
    features: ["Sound-deadened top", "Marine edge option available", "Reinforced hat channels", "Rust-resistant"],
    specifications: "Load Capacity: 300kg (Top), 150kg (Shelf)",
    material: "100% Stainless Steel 304",
    size: "1200mm x 600mm x 850mm",
    capacity: "N/A",
    warranty: "Lifetime Rust Warranty",
    applications: "Food Preparation, Plating, Utility Storage"
  },

  // SML
  {
    name: "SML Dynamic Pass Box",
    category: "sml-cleanroom",
    brands: "SML Clean Room Solutions",
    sku: "SML-DPB-100",
    price: "Custom Quote",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80",
    description: "Dynamic pass boxes are used to transfer materials between environments of different cleanliness levels while preventing contamination. Features HEPA filtration and UV sterilization.",
    features: ["HEPA Filter (99.997% efficiency at 0.3 micron)", "Electromagnetic Interlocking doors", "UV Germicidal Lamp with hour meter", "Magnehelic differential pressure gauge"],
    specifications: "Air Velocity: 0.45 ± 0.05 m/s\nNoise Level: < 65 dB\nPower: 220V/50Hz",
    material: "SS 304 / SS 316L Double Walled Construction",
    size: "600mm x 600mm x 600mm (Internal)",
    capacity: "N/A",
    warranty: "1 Year Standard",
    applications: "Pharmaceuticals, Biotech Labs, Healthcare"
  },
  {
    name: "SML Laminar Air Flow Unit (LAF)",
    category: "sml-cleanroom",
    brands: "SML Clean Room Solutions",
    sku: "SML-LAF-200",
    price: "Custom Quote",
    image: "https://images.unsplash.com/photo-1574360341764-77e4cb45ed8b?auto=format&fit=crop&w=800&q=80",
    description: "Provides a Class 100 sterile working environment for sensitive processes. Available in vertical or horizontal airflow configurations.",
    features: ["ISO Class 5 environment", "Washable pre-filters", "Feather-touch controls", "DOP validation port"],
    specifications: "Filtration: HEPA/ULPA\nIllumination: > 800 Lux\nAirflow: Vertical or Horizontal",
    material: "SS 304 Working Table, Powder Coated MS Body",
    size: "4ft x 2ft (Working Area)",
    capacity: "1-2 Operators",
    warranty: "1 Year Standard",
    applications: "Tissue Culture, Microbiology, Electronics Assembly"
  },

  // Gee Bee
  {
    name: "Gee Bee Rotary Rack Oven (120 Loaves)",
    category: "geebee-bakery",
    brands: "Gee Bee Industrial Products",
    sku: "GB-RO-120",
    price: "Contact for Price",
    image: "https://images.unsplash.com/photo-1627907228175-2bf83f6f16de?auto=format&fit=crop&w=800&q=80",
    description: "High-efficiency rotary rack oven designed for even baking of breads, cookies, and cakes. Available in diesel, gas, or electric heating options.",
    features: ["Even heat distribution system", "Steam generation capability", "High-density insulation for energy saving", "Digital timer and temperature controller"],
    specifications: "Max Temperature: 300°C\nHeating Option: Diesel / Gas / Electric\nTray Size: 18\" x 26\"",
    material: "Stainless Steel Front and Chamber",
    size: "6.5ft x 5ft x 7.5ft",
    capacity: "120 Loaves (400g) per batch",
    warranty: "1 Year Manufacturer",
    applications: "Wholesale Bakeries, Large Cafes, Food Factories"
  },
  {
    name: "Gee Bee 40L Planetary Dough Mixer",
    category: "geebee-bakery",
    brands: "Gee Bee Industrial Products",
    sku: "GB-PM-40",
    price: "Contact for Price",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    description: "Heavy-duty multi-functional planetary mixer suitable for kneading dough, mixing cake batter, and whipping creams.",
    features: ["3-Speed gear system", "Includes Dough Hook, Beater, and Wire Whip", "Safety guard with auto-stop", "Heavy cast-iron base for stability"],
    specifications: "Power: 2 HP Motor\nVoltage: 220V/50Hz\nSpeeds: 130 / 260 / 480 RPM",
    material: "SS 304 Bowl and Attachments",
    size: "550mm x 650mm x 1100mm",
    capacity: "40 Liters (Max Dough 12kg)",
    warranty: "1 Year Manufacturer",
    applications: "Bakeries, Restaurants, Pizza Shops"
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    console.log("Clearing existing data for these specific categories/products...");
    const categoryIds = categoriesData.map(c => c.id);
    await Category.deleteMany({ id: { $in: categoryIds } });
    await Product.deleteMany({ category: { $in: categoryIds } });

    console.log("Inserting Categories...");
    for (const cat of categoriesData) {
      await Category.create(cat);
    }

    console.log("Inserting Products...");
    for (const prod of productsData) {
      await Product.create(prod);
    }

    console.log("Updating Category counts...");
    for (const catId of categoryIds) {
      const count = await Product.countDocuments({ category: catId });
      await Category.findOneAndUpdate({ id: catId }, { count });
    }

    console.log("Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
