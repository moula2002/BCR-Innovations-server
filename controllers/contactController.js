const Contact = require('../models/Contact');

// @desc    Create new contact message
// @route   POST /api/contacts
// @access  Public
const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private (Admin only - typically)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // Newest first
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  createContact,
  getContacts
};
