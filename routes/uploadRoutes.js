const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Image = require('../models/Image');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  try {
    const filetypes = /jpg|jpeg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only! (jpg, jpeg, png, webp, gif)'));
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

    const filename = `${Date.now()}-${req.file.originalname}`;
    
    // Save image buffer as a base64 string to MongoDB directly
    const newImage = new Image({
      name: filename,
      data: req.file.buffer.toString('base64'),
      contentType: req.file.mimetype
    });
    
    await newImage.save();

    res.send(newImage._id.toString());
  } catch (error) {
    console.error('Route error:', error);
    return res.status(500).json({ error: 'Internal Server Error during upload' });
  }
});

module.exports = router;
