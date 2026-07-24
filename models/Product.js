const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String, // matching the custom 'id' field in Category
    required: true
  },
  price: {
    type: String,
    default: ''
  },
  brands: {
    type: String,
    default: ''
  },
  sku: {
    type: String,
    default: ''
  },
  features: {
    type: [String],
    default: []
  },
  specifications: {
    type: String,
    default: ''
  },
  material: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  capacity: {
    type: String,
    default: ''
  },
  warranty: {
    type: String,
    default: ''
  },
  applications: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
