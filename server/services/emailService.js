const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.EMAIL_FROM) {
    throw new Error('SMTP email configuration is incomplete');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

const sendPasswordResetEmail = async (email, resetUrl) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your EstateHub password',
    text: `Use this link to reset your EstateHub password: ${resetUrl}\n\nThis link expires soon and can only be used once.`,
    html: `<p>Use the link below to reset your EstateHub password:</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires soon and can only be used once.</p>`
  });
};

module.exports = { sendPasswordResetEmail };
