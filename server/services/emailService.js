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
    from: process.env.EMAIL_FROM || '"TravelGO" <vasanijay3008@gmail.com>',
    to: email,
    subject: 'TravelGO - Email Verification OTP',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 30px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">TravelGO</h1>
          <p style="color: #93c5fd; margin: 6px 0 0; font-size: 13px;">Your Reliable Travel Partner</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 24px;">
          <h2 style="color: #1f2937; margin: 0 0 8px; font-size: 20px;">Email Verification</h2>
          <p style="color: #6b7280; margin: 0 0 24px; font-size: 14px; line-height: 1.6;">
            Hi <strong>${name}</strong>, welcome to TravelGO! Use the OTP below to verify your email address.
          </p>

          <!-- OTP Box -->
          <div style="background: #f0f9ff; border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Your Verification Code</p>
            <p style="margin: 0; font-size: 36px; font-weight: 800; color: #1e40af; letter-spacing: 8px;">${otp}</p>
          </div>

          <p style="color: #9ca3af; font-size: 13px; margin: 0 0 8px;">
            ⏰ This OTP expires in <strong>10 minutes</strong>.
          </p>
          <p style="color: #9ca3af; font-size: 13px; margin: 0;">
            If you didn't create an account on TravelGO, please ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 11px;">© ${new Date().getFullYear()} TravelGO. All rights reserved.</p>
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
    from: process.env.EMAIL_FROM || '"TravelGO" <vasanijay3008@gmail.com>',
    to: email,
    subject: 'TravelGO - Password Reset Request',
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
