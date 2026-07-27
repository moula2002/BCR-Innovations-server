const Career = require('../models/Career');

// @desc    Get all careers
// @route   GET /api/careers
// @access  Public
const getCareers = async (req, res) => {
  try {
    const careers = await Career.find().lean();
    res.status(200).json({ success: true, data: careers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create career
// @route   POST /api/careers
// @access  Private
const createCareer = async (req, res) => {
  try {
    const { title, department, location, type, description } = req.body;
    
    if (!title || !department || !location || !type) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    const career = await Career.create({ 
      title, department, location, type, description: description || '' 
    });
    res.status(201).json({ success: true, data: career });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update career
// @route   PUT /api/careers/:id
// @access  Private
const updateCareer = async (req, res) => {
  try {
    const { title, department, location, type, description } = req.body;
    
    let career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, error: 'Career not found' });
    }

    career = await Career.findByIdAndUpdate(
      req.params.id,
      { title, department, location, type, description },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: career });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete career
// @route   DELETE /api/careers/:id
// @access  Private
const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({ success: false, error: 'Career not found' });
    }

    await Career.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getCareers,
  createCareer,
  updateCareer,
  deleteCareer
};
