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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    default: null
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
