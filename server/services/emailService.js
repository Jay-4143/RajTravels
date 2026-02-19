/**
 * Email Service - Nodemailer Placeholder
 * Ready for SMTP/ transactional email integration
 */

const nodemailer = require('nodemailer');

// Create transporter - configure with actual SMTP in production
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetUrl) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Travel Booking" <noreply@travel.com>',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };
  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      return { success: true };
    }
    // Placeholder - log for development
    console.log('[Email] Password reset would be sent to:', email, 'URL:', resetUrl);
    return { success: true };
  } catch (err) {
    console.error('Email send error:', err);
    throw err;
  }
};

/**
 * Send booking confirmation email
 */
const sendBookingConfirmation = async (email, bookingRef, details) => {
  console.log('[Email] Booking confirmation would be sent to:', email, 'Ref:', bookingRef);
  return { success: true };
};

module.exports = { sendPasswordResetEmail, sendBookingConfirmation };
