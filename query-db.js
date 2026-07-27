require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const cats = await Category.find({});
  const subs = await Subcategory.find({});
  console.log("Categories:", cats.map(c => ({ id: c.id, name: c.name })));
  console.log("Subcategories:", subs.map(s => ({ id: s.id, name: s.name, parent: s.parentCategory })));
  process.exit(0);
});
