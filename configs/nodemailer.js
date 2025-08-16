const nodemailer = require('nodemailer');

// Create and export reusable transporter object
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Port for SSL
  secure: true, // SSL enabled
  auth: {
    user: process.env.EMAIL_USER, // Gmail email from environment variables
    pass: process.env.EMAIL_PASS, // Gmail app password from environment variables
  },
  debug: process.env.NODE_ENV !== 'production', // Enable debugging in development
  logger: process.env.NODE_ENV !== 'production', // Enable logging in development
});

// Test if the configuration is valid
const verifyEmailConfig = async () => {
  try {
    const connectionCheck = await transporter.verify();
    console.log('Nodemailer configuration verified successfully');
    return connectionCheck;
  } catch (error) {
    console.error('Error verifying email configuration:', error);
    return false;
  }
};

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Inventaris System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const generateResetPasswordEmail = (resetLink, userNama) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; text-align: center; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 5px 5px; }
        .button { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Password</h1>
        </div>
        <div class="content">
          <h2>Halo, ${userNama}!</h2>
          <p>Kami menerima permintaan untuk mereset password akun Anda pada sistem Inventaris.</p>
          <p>Klik tombol dibawah ini untuk mereset password Anda:</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>Atau copy dan paste link berikut ke browser Anda:</p>
          <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 3px;">${resetLink}</p>
          <p><strong>Link ini akan kedaluwarsa dalam 1 jam.</strong></p>
          <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 SEMANIS BMN. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  transporter,
  verifyEmailConfig,
  sendEmail,
  generateResetPasswordEmail
};