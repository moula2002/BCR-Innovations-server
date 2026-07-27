const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Image = require('./models/Image');

const updateDocs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collections = ['products', 'categories', 'subcategories', 'logos'];
    
    for (const col of collections) {
      try {
        const collection = db.collection(col);
        // Find documents where the image field is a string
        const docs = await collection.find({ image: { $type: "string" } }).toArray();
        let count = 0;
        
        for (const doc of docs) {
          const imageStr = doc.image;
          
          // Extract filename from the string path
          let filename = '';
          if (imageStr.includes('/uploads/')) {
            filename = imageStr.split('/uploads/').pop();
          } else {
            filename = imageStr.split('/').pop();
          }
          
          if (!filename) continue;

          const filePath = path.join(__dirname, 'uploads', filename);
          
          if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath);
            let ext = path.extname(filename).substring(1) || 'jpeg';
            if (ext === 'jpg') ext = 'jpeg';
            const contentType = `image/${ext}`;
            
            // Create and save the new Image document containing base64 string
            const newImage = new Image({
              name: filename,
              data: fileData.toString('base64'),
              contentType: contentType
            });
            
            const savedImage = await newImage.save();
            
            // Update the original document to reference the new Image ObjectId
            await collection.updateOne({ _id: doc._id }, { $set: { image: savedImage._id } });
            count++;
            console.log(`Updated document ${doc._id} in ${col}`);
          } else {
            console.log(`Skipped ${doc._id} - File not found: ${filePath}`);
          }
        }
        console.log(`Finished processing ${col}. Updated ${count} documents.`);
      } catch (err) {
        console.log(`Skipping collection ${col} due to error: ${err.message}`);
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
