/**
 * Visa Routes
 * /api/visa/*
 */

const express = require('express');
const router = express.Router();
const visaController = require('../controllers/visaController');
const { protect } = require('../middleware/authMiddleware');

router.get('/countries', visaController.getCountries);
router.get('/my-applications', protect, visaController.getMyApplications);
router.get('/', visaController.getVisas);
router.get('/:id', visaController.getVisaById);
router.post('/:id/apply', protect, visaController.submitApplication);

module.exports = router;
