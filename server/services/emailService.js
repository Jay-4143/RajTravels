/**
 * Email Service - Nodemailer with Gmail SMTP
 * OTP verification, password reset, booking confirmation
 */

const nodemailer = require('nodemailer');

// Create Gmail transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Generate 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP verification email
 */
const sendOtpEmail = async (email, otp, name = 'User') => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Raj Travel" <vasanijay3008@gmail.com>',
    to: email,
    subject: 'Raj Travel - Email Verification OTP',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background-color: #2563eb; padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Raj Travel</h1>
        </div>
        <div style="padding: 40px 30px; background-color: #ffffff;">
          <h2 style="color: #111827; margin: 0 0 20px; font-size: 22px; font-weight: 600;">Verify Your Email</h2>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px; font-size: 16px;">
            Hi <strong>${name}</strong>, welcome to Raj Travel! Use the OTP below to verify your email address.
          </p>
          <div style="background-color: #f3f4f6; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #2563eb;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;"> This OTP is valid for the next 10 minutes. </p>
        </div>
        <div style="padding: 30px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
            If you didn't create an account on Raj Travel, please ignore this email.
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 11px;">© ${new Date().getFullYear()} Raj Travel. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      console.log('[Email] OTP sent to:', email);
      return { success: true };
    }
    // Dev fallback
    console.log(`[Email] OTP for ${email}: ${otp}`);
    return { success: true };
  } catch (err) {
    console.error('OTP email send error:', err.message);
    throw err;
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetUrl) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Raj Travel" <vasanijay3008@gmail.com>',
    to: email,
    subject: 'Raj Travel - Password Reset Request',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2>Password Reset</h2>
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
        <p style="color: #9ca3af; margin-top: 16px; font-size: 13px;">This link expires in 1 hour.</p>
        <p style="color: #9ca3af; font-size: 13px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };
  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      return { success: true };
    }
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

module.exports = { generateOTP, sendOtpEmail, sendPasswordResetEmail, sendBookingConfirmation };
