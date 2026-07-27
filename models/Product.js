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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    default: null
  },
  category: {
    type: String, // matching the custom 'id' field in Category
    required: true
  },
  subcategory: {
    type: String, // matching the custom 'id' field in Subcategory
    default: ''
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
