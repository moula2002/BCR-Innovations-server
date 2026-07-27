const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const fs = require('fs');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    try {
      const dir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    } catch (err) {
      console.error('Destination error:', err);
      cb(err);
    }
  },
  filename(req, file, cb) {
    try {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    } catch (err) {
      console.error('Filename error:', err);
      cb(err);
    }
  }
});

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

router.post('/', protect, (req, res) => {
  try {
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ error: err.message || 'Error uploading file' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No image provided' });
      }
      res.send(`/uploads/${req.file.filename}`);
    });
  } catch (error) {
    console.error('Route error:', error);
    return res.status(500).json({ error: 'Internal Server Error during upload' });
  }
});

module.exports = router;
