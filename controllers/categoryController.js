const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    
    // Dynamically calculate the accurate product count for each category
    for (const cat of categories) {
      cat.count = await Product.countDocuments({ category: cat.id });
    }
    
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const { id, name, description, image, seoTitle, seoDescription } = req.body;
    
    if (!id || !name) {
      return res.status(400).json({ success: false, error: 'Please provide ID and Name' });
    }

    const categoryExists = await Category.findOne({ id });
    if (categoryExists) {
      return res.status(400).json({ success: false, error: 'Category ID already exists' });
    }

    const category = await Category.create({ 
      id, 
      name, 
      description: description || '',
      image: image || '',
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      count: 0 
    });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const { name, description, image, seoTitle, seoDescription } = req.body;
    
    let category = await Category.findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    category = await Category.findOneAndUpdate(
      { id: req.params.id },
      { name, description, image, seoTitle, seoDescription },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ id: req.params.id });

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    await Category.deleteOne({ id: req.params.id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
