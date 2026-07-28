const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');

// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public
const getSubcategories = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { parentCategory: category } : {};
    
    const subcategories = await Subcategory.find(filter).lean();
    
    // Dynamically calculate the accurate product count for each subcategory
    for (const sub of subcategories) {
      sub.count = await Product.countDocuments({ subcategory: sub.id });
    }
    
    res.status(200).json({ success: true, data: subcategories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create subcategory
// @route   POST /api/subcategories
// @access  Private
const createSubcategory = async (req, res) => {
  try {
    const { id, name, parentCategory, description, image } = req.body;
    
    if (!id || !name || !parentCategory) {
      return res.status(400).json({ success: false, error: 'Please provide ID, Name, and Parent Category' });
    }

    const exists = await Subcategory.findOne({ id });
    if (exists) {
      return res.status(400).json({ success: false, error: 'Subcategory ID already exists' });
    }

    const subcategory = await Subcategory.create({ 
      id, 
      name, 
      parentCategory,
      description: description || '',
      image: image || '',
      count: 0 
    });
    res.status(201).json({ success: true, data: subcategory });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update subcategory
// @route   PUT /api/subcategories/:id
// @access  Private
const updateSubcategory = async (req, res) => {
  try {
    const { name, parentCategory, description, image } = req.body;
    
    let subcategory = await Subcategory.findOne({ id: req.params.id });
    if (!subcategory) {
      return res.status(404).json({ success: false, error: 'Subcategory not found' });
    }

    subcategory = await Subcategory.findOneAndUpdate(
      { id: req.params.id },
      { name, parentCategory, description, image },
      { returnDocument: 'after', runValidators: true }
    );

    res.status(200).json({ success: true, data: subcategory });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete subcategory
// @route   DELETE /api/subcategories/:id
// @access  Private
const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({ id: req.params.id });

    if (!subcategory) {
      return res.status(404).json({ success: false, error: 'Subcategory not found' });
    }

    await Subcategory.deleteOne({ id: req.params.id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
};
