const mongoose = require('mongoose');
require('dotenv').config();

const updateDocs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collections = ['products', 'categories', 'subcategories', 'logos'];
    
    for (const col of collections) {
      try {
        const collection = db.collection(col);
        const docs = await collection.find({ image: { $regex: '^https://bcr-innovations-server-1.onrender.com' } }).toArray();
        let count = 0;
        for (const doc of docs) {
          const newImage = doc.image.replace('https://bcr-innovations-server-1.onrender.com', '');
          await collection.updateOne({ _id: doc._id }, { $set: { image: newImage } });
          count++;
        }
        console.log(`Updated ${count} documents in ${col}`);
      } catch (err) {
        console.log(`Skipping collection ${col} due to error or non-existence`);
      }
    }
    console.log('Database updated successfully');
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

updateDocs();
