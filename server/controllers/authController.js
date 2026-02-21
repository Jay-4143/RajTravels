/**
 * Authentication Controller
 * Register (with OTP), Login (verified only), Google Auth, Verify OTP, Resend OTP
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { addToBlacklist } = require('../utils/tokenBlacklist');
const { sendPasswordResetEmail, generateOTP, sendOtpEmail } = require('../services/emailService');

/**
 * Generate JWT Token
 */
const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * @desc    Register user - sends OTP, does NOT auto-login
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists && userExists.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // If user exists but not verified, update and resend OTP
    if (userExists && !userExists.isEmailVerified) {
      const otp = generateOTP();
      userExists.name = name;
      userExists.password = password;
      userExists.otp = otp;
      userExists.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      await userExists.save();

      try {
        await sendOtpEmail(email, otp, name);
      } catch (emailErr) {
        console.error('Failed to send OTP email:', emailErr.message);
      }

      return res.status(200).json({
        success: true,
        message: 'OTP sent to your email for verification',
        requiresVerification: true,
        email: email,
      });
    }

    // New user
    const otp = generateOTP();
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      isEmailVerified: false,
    });

    try {
      await sendOtpEmail(email, otp, name);
    } catch (emailErr) {
      console.error('Failed to send OTP email:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email for verification',
      requiresVerification: true,
      email: email,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify OTP and complete registration
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email }).select('+otp');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Mark verified and clear OTP
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Email verified successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resend OTP
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    try {
      await sendOtpEmail(email, otp, user.name);
    } catch (emailErr) {
      console.error('Failed to resend OTP:', emailErr.message);
    }

    res.json({
      success: true,
      message: 'New OTP sent to your email',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user - must be email-verified
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if registered via Google (no password)
    if (!user.password && user.googleId) {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google Sign-In. Please login with Google.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Must be verified
    if (!user.isEmailVerified) {
      // Auto-send a new OTP
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save({ validateBeforeSave: false });

      try {
        await sendOtpEmail(email, otp, user.name);
      } catch (emailErr) {
        console.error('Failed to send OTP:', emailErr.message);
      }

      return res.status(403).json({
        success: false,
        message: 'Email not verified. A new OTP has been sent to your email.',
        requiresVerification: true,
        email: email,
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Google Sign-In / Sign-Up
 * @route   POST /api/auth/google
 * @access  Public
 */
exports.googleAuth = async (req, res, next) => {
  try {
    const { credential, name, email, googleId, picture } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ success: false, message: 'Google auth data is required' });
    }

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // Link Google ID if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
      }
      // Auto-verify Google users
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      await user.save({ validateBeforeSave: false });
    } else {
      // Create new user - Google users are auto-verified
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        avatar: picture || null,
        isEmailVerified: true,
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const fields = ['name', 'phone'];
    const updates = {};
    fields.forEach(f => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update password (when logged in)
 * @route   PUT /api/auth/password
 * @access  Private
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id, user.role);
    res.json({ success: true, message: 'Password updated', token });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password - send reset token via email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  let user;
  try {
    const { email } = req.body;
    user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    next(error);
  }
};

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const jwtToken = generateToken(user._id, user.role);
    res.json({ success: true, message: 'Password reset successful', token: jwtToken });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout - invalidate token
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      addToBlacklist(token);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
