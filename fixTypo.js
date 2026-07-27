const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const result = await Product.updateMany(
    { category: 'Display Cabinates' }, 
    { $set: { category: 'Display Cabinets' } }
  );
  console.log('Update result for Products:', result);
  mongoose.disconnect();
}).catch(console.error);
