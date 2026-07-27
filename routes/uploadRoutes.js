const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  try {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only! (jpg, jpeg, png, webp)'));
    }
  } catch (err) {
    console.error('File filter error:', err);
    cb(err);
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    const filename = `image-${Date.now()}${path.extname(req.file.originalname)}`;
    
    // Create an upload stream to GridFS
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype
    });
    
    // Write the buffer to the stream
    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', () => {
      res.send(`/uploads/${filename}`);
    });

    uploadStream.on('error', (err) => {
      console.error('GridFS Upload Error:', err);
      res.status(500).json({ error: 'Failed to upload image to database' });
    });

  } catch (error) {
    console.error('Route error:', error);
    return res.status(500).json({ error: 'Internal Server Error during upload' });
  }
});

module.exports = router;
