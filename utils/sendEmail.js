const nodemailer = require('nodemailer');

const sendEmail = async ({ to = 'bcrinnovations2026@gmail.com', subject, html, text, replyTo }) => {
  const targetEmail = 'bcrinnovations2026@gmail.com';
  const hasSmtpConfig = Boolean(process.env.EMAIL_PASS || process.env.GMAIL_PASS || process.env.SMTP_PASS);

  if (hasSmtpConfig) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER || process.env.GMAIL_USER || targetEmail,
          pass: process.env.EMAIL_PASS || process.env.GMAIL_PASS || process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"BCR Innovations" <${process.env.GMAIL_USER || targetEmail}>`,
        to: targetEmail,
        replyTo: replyTo || targetEmail,
        subject: subject,
        html: html,
        text: text,
      });

      console.log('Nodemailer email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Nodemailer SMTP Error, attempting fallback delivery:', error);
    }
  }

  // Fallback public email transport directly to bcrinnovations2026@gmail.com
  try {
    const web3Key = process.env.WEB3FORMS_KEY;
    if (!web3Key || web3Key.includes('#')) {
      console.warn('Fallback email transport skipped: WEB3FORMS_KEY is not set or contains placeholder format.');
      return { success: false, error: 'SMTP failed and no valid Web3Forms API key configured' };
    }

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: web3Key,
        email_to: targetEmail,
        name: replyTo || 'Website Visitor',
        email: replyTo || targetEmail,
        subject: subject,
        message: text || html,
        from_name: 'BCR Innovations Server',
      }),
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Fallback email transport returned non-JSON response:', responseText.substring(0, 200));
      return { success: false, error: 'Fallback email API returned non-JSON response' };
    }

    if (response.ok && data.success) {
      console.log('Fallback email transport response:', data);
      return { success: true, data };
    } else {
      console.error('Fallback email transport failed:', data);
      return { success: false, error: data.message || 'Fallback delivery failed' };
    }
  } catch (fallbackError) {
    console.error('Fallback email delivery error:', fallbackError.message);
    return { success: false, error: fallbackError.message };
  }
};

module.exports = sendEmail;
