const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  await db.collection('categories').updateMany({ image: { $type: 'string' } }, { $set: { image: null } });
  await db.collection('products').updateMany({ image: { $type: 'string' } }, { $set: { image: null } });
  await db.collection('subcategories').updateMany({ image: { $type: 'string' } }, { $set: { image: null } });
  console.log('Done migrating');
  process.exit(0);
});
