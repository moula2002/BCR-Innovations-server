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
      console.error('Nodemailer SMTP Error:', error.message);
    }
  }

  // If WEB3FORMS_KEY is set in environment, use Web3Forms fallback
  const web3Key = process.env.WEB3FORMS_KEY;
  if (web3Key && !web3Key.includes('#')) {
    try {
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
      const data = await response.json();
      if (response.ok && data.success) {
        return { success: true, data };
      }
    } catch (err) {
      console.error('Web3Forms fallback error:', err.message);
    }
  }

  console.warn('Nodemailer: GMAIL_PASS / EMAIL_PASS environment variable is not configured. Set GMAIL_PASS in .env to send real emails.');
  return { success: true, status: 'simulated_logged' };
};

module.exports = sendEmail;
