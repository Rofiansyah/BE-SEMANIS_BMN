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
      from: `"SEMANIS-BMN" <${process.env.EMAIL_USER}>`,
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
  <title>Lupa Password</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f9fafb; color: #333; }
    .container { max-width: 480px; margin: 0 auto; padding: 20px; }
    .card { background: #fff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); padding: 30px 24px; }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo img { max-height: 80px; max-width: 100%; object-fit: contain; }
    .title { text-align: center; font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #111827; }
    .subtitle { text-align: center; font-size: 14px; color: #4b5563; margin-bottom: 24px; }
    .button { 
  display: block; 
  width: 100%; 
  text-align: center; 
  background: #162456; 
  color: #fff;              /* <-- pastikan teks putih */
  padding: 14px 0; 
  border-radius: 8px; 
  text-decoration: none; 
  font-size: 16px; 
  font-weight: 600; 
  margin: 20px 0; 
}

    .link-box { word-break: break-all; background: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 13px; color: #1f2937; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 20px; }
    .back-link { font-size: 13px; color: #1e3a8a; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">

      <!-- Logo -->
      <div class="logo">
        <img src="https://drive.google.com/uc?export=view&id=1NDP97vjsJ7QA4XLtnwZu0OGdP-PfbPhP" alt="SEMANTIS BMN Logo">
      </div>

      <!-- Title -->
      <div class="title">Reset Password</div>
      <div class="subtitle">Halo, ${userNama}! Klik tombol di bawah ini untuk mengatur ulang password Anda.</div>

      <!-- Button -->
      <a href="${resetLink}" class="button">Reset Password</a>

      <!-- Alternative Link -->
      <p style="font-size: 14px; color: #374151; margin-bottom: 6px;">Atau copy link berikut ke browser Anda:</p>
      <div class="link-box">${resetLink}</div>

      <p style="font-size: 13px; color: #b91c1c; margin-top: 12px;"><strong>Link ini hanya berlaku 1 jam.</strong></p>
      <p style="font-size: 13px; color: #4b5563;">Jika Anda tidak meminta reset password, abaikan email ini.</p>

      <div style="margin-top: 24px; text-align: center;">
        <a href="/login/user" class="back-link">Kembali ke login</a>
      </div>

    </div>

    <!-- Footer -->
    <div class="footer">
      <p>© 2025 SEMANIS BMN. All rights reserved.</p>
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