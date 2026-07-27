const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  parentCategory: {
    type: String, // matching the 'id' field in Category
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;
