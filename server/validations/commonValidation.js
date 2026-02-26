const { body } = require('express-validator');

/**
 * Common validation chains used across different routes
 */
const commonValidation = {
    mobile: (field = 'mobile') => body(field)
        .trim()
        .notEmpty().withMessage('Mobile number is required')
        .isNumeric().withMessage('Mobile number must be numeric only')
        .isLength({ min: 10, max: 10 }).withMessage('Please enter a valid 10-digit mobile number'),

    email: (field = 'email') => body(field)
        .trim()
        .notEmpty().withMessage('Email address is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),

    name: (field = 'name') => body(field)
        .trim()
        .notEmpty().withMessage('Name is required')
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Name should contain only alphabets')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

    password: (field = 'password') => body(field)
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must include one uppercase, one lowercase, one number and one special character'),

    aadhaar: (field = 'idNumber') => body(field)
        .if((v, { req }) => req.body.idType === 'Aadhar')
        .trim()
        .isNumeric().withMessage('Aadhaar must be numeric only')
        .isLength({ min: 12, max: 12 }).withMessage('Please enter a valid 12-digit Aadhaar number'),

    pan: (field = 'idNumber') => body(field)
        .if((v, { req }) => req.body.idType === 'PAN')
        .trim()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage('Please enter a valid 10-character PAN'),

    passport: (field = 'idNumber') => body(field)
        .if((v, { req }) => req.body.idType === 'Passport')
        .trim()
        .isAlphanumeric().withMessage('Passport must be alphanumeric')
        .isLength({ min: 7, max: 12 }).withMessage('Please enter a valid Passport number'),
};

module.exports = commonValidation;
