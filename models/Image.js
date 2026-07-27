const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Image', imageSchema);
