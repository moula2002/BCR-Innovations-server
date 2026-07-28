const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Image = require('../models/Image');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  try {
    const filetypes = /jpg|jpeg|png|webp|gif|svg|avif|bmp|ico/;
    const extname = filetypes.test(path.extname(file.originalname || '').toLowerCase());
    const mimetype = filetypes.test(file.mimetype) || (file.mimetype && file.mimetype.startsWith('image/'));

    if (extname || mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Images only! (jpg, jpeg, png, webp, gif, svg, avif)'));
    }
  } catch (err) {
    console.error('File filter error:', err);
    return cb(err);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

router.post('/', protect, (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    
    // Save image buffer as a base64 string to MongoDB directly
    const newImage = new Image({
      name: filename,
      data: req.file.buffer.toString('base64'),
      contentType: req.file.mimetype
    });
    
    await newImage.save();

    res.status(201).send(newImage._id.toString());
  } catch (error) {
    console.error('Route error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error during upload' });
  }
});

module.exports = router;
