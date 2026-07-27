const express = require('express');
const router = express.Router();
const { getCareers, createCareer, updateCareer, deleteCareer } = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCareers)
  .post(protect, createCareer);

router.route('/:id')
  .put(protect, updateCareer)
  .delete(protect, deleteCareer);

module.exports = router;
