const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const sanitize = require('../middleware/sanitizeMiddleware');
const common = require('../validations/commonValidation');
const { body, validationResult } = require('express-validator');

// Validation Result Middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array().map(e => ({ field: e.path, message: e.msg })) });
  }
  next();
};

const registerValidation = [
  common.name(),
  common.email(),
  common.password(),
];

const loginValidation = [
  common.email(),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidation = [
  common.email(),
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  common.password(),
];

const updateProfileValidation = [
  common.name().optional(),
  common.mobile('phone').optional(),
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  common.password('newPassword'),
];

// Apply global sanitization to all auth routes
router.use(sanitize);

// Public routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/google', authController.googleAuth);
router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, authController.resetPassword);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, updateProfileValidation, validate, authController.updateProfile);
router.put('/password', protect, updatePasswordValidation, validate, authController.updatePassword);
router.post('/logout', protect, authController.logout);

module.exports = router;
