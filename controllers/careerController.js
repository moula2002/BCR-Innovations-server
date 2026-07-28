const Career = require('../models/Career');
const sendEmail = require('../utils/sendEmail');

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

// @desc    Apply for a career position & send Nodemailer email to bcrinnovations2026@gmail.com
// @route   POST /api/careers/apply
// @access  Public
const applyCareer = async (req, res) => {
  try {
    const { name, email, phone, experience, note, jobTitle, department } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and Email are required fields' });
    }

    const applicantName = name;
    const targetPosition = jobTitle || 'General Position';
    const applicantDept = department || 'General';

    const subject = `[Job Application] ${targetPosition} - ${applicantName}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #0277bd; padding: 24px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">BCR INNOVATIONS</h2>
          <span style="display: inline-block; background-color: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-top: 6px; text-transform: uppercase;">
            New Career Job Application
          </span>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 150px;">Position Applied:</td>
              <td style="padding: 8px 0; color: #0277bd; font-weight: bold; font-size: 15px;">${targetPosition}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Department:</td>
              <td style="padding: 8px 0;">${applicantDept}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Applicant Name:</td>
              <td style="padding: 8px 0;">${applicantName}</td>
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
            ${experience ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Total Experience:</td>
              <td style="padding: 8px 0; font-weight: bold;">${experience}</td>
            </tr>` : ''}
          </table>

          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
            <p style="font-weight: bold; margin-bottom: 8px; color: #0f172a;">Cover Note / Resume Link:</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #334155;">
              ${note || 'No additional note provided.'}
            </div>
          </div>

          <div style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            Sent automatically via BCR Innovations Backend Server Nodemailer.
          </div>
        </div>
      </div>
    `;

    const text = `NEW CAREER JOB APPLICATION\n\nPosition: ${targetPosition}\nDepartment: ${applicantDept}\nName: ${applicantName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nExperience: ${experience || 'N/A'}\n\nCover Note / Resume Link:\n${note || 'N/A'}`;

    await sendEmail({
      to: 'bcrinnovations2026@gmail.com',
      replyTo: email,
      subject,
      html,
      text
    });

    res.status(200).json({ success: true, message: 'Application submitted and emailed to bcrinnovations2026@gmail.com' });
  } catch (error) {
    console.error('Error in applyCareer:', error);
    res.status(500).json({ success: false, error: 'Failed to process job application' });
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
      { returnDocument: 'after', runValidators: true }
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
  applyCareer,
  createCareer,
  updateCareer,
  deleteCareer
};
