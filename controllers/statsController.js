const Product = require('../models/Product');
const Category = require('../models/Category');
const Contact = require('../models/Contact');

// @desc    Get dashboard stats
// @route   GET /api/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalInquiries = await Contact.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalInquiries
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = { getStats };
