require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const cats = await Category.find({});
  const subs = await Subcategory.find({});
  const prods = await Product.find({});
  console.log("Categories:", cats.map(c => ({ id: c.id, name: c.name })));
  console.log("Subcategories:", subs.map(s => ({ id: s.id, name: s.name, parent: s.parentCategory })));
  console.log("Products:", prods.map(p => ({ id: p._id, name: p.name, category: p.category, subcategory: p.subcategory, image: p.image })));
  process.exit(0);
});
