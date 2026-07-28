const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new contact message & send Nodemailer email to bcrinnovations2026@gmail.com
// @route   POST /api/contacts
// @access  Public
const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message, product } = req.body;

    if (!firstName || !email || (!message && !subject)) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    const contact = await Contact.create({
      firstName,
      lastName: lastName || '',
      email,
      subject,
      message
    });

    const senderName = `${firstName || ''} ${lastName || ''}`.trim();
    const mailSubject = subject ? `[BCR Inquiry] ${subject}` : `[BCR Web Inquiry] Message from ${senderName}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #0277bd; padding: 24px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">BCR INNOVATIONS</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">New Web Customer Inquiry</p>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px;">Customer Name:</td>
              <td style="padding: 8px 0;">${senderName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email Address:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0277bd; text-decoration: none;">${email}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone Number:</td>
              <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #0277bd; text-decoration: none;">${phone}</a></td>
            </tr>` : ''}
            ${product ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Product Interested:</td>
              <td style="padding: 8px 0; color: #0277bd; font-weight: bold;">${product}</td>
            </tr>` : ''}
            ${subject ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
              <td style="padding: 8px 0;">${subject}</td>
            </tr>` : ''}
          </table>

          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
            <p style="font-weight: bold; margin-bottom: 8px; color: #0f172a;">Message Content:</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #334155;">
              ${message || 'No additional message provided.'}
            </div>
          </div>

          <div style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            Sent automatically via BCR Innovations Backend Server Nodemailer.
          </div>
        </div>
      </div>
    `;

    const text = `NEW CUSTOMER INQUIRY\n\nName: ${senderName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nProduct: ${product || 'N/A'}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`;

    if (!req.body.skipEmail) {
      try {
        await sendEmail({
          to: 'bcrinnovations2026@gmail.com',
          replyTo: email,
          subject: mailSubject,
          html,
          text
        });
      } catch (mailErr) {
        console.warn('Nodemailer background mail warning:', mailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(200).json({ success: true, message: 'Message received' });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private (Admin only - typically)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

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
