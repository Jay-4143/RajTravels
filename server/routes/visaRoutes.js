const express = require('express');
const router = express.Router();
const visaController = require('../controllers/visaController');
const { protect } = require('../middleware/authMiddleware');
const sanitize = require('../middleware/sanitizeMiddleware');
const common = require('../validations/commonValidation');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array().map(e => ({ field: e.path, message: e.msg })) });
    }
    next();
};

const inquiryValidation = [
    common.name('firstName'),
    common.name('lastName'),
    common.email(),
    common.mobile('phone'),
    body('travelDate').notEmpty().withMessage('Travel date is required'),
];

router.use(sanitize);

// Static routes first to avoid ID collision
router.get('/', visaController.getAllVisas);
router.get('/options', visaController.getVisaOptions);
router.post('/search', visaController.searchVisas);
router.post('/inquiry', inquiryValidation, validate, visaController.submitInquiry);

// Dynamic routes last
router.get('/:id', visaController.getVisaById);

module.exports = router;
