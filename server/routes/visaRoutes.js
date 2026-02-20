const express = require('express');
const router = express.Router();
const {
    getVisaOptions,
    searchVisas,
    getVisaById,
    createInquiry
} = require('../controllers/visaController');

router.get('/options', getVisaOptions);
router.post('/search', searchVisas);
router.get('/:id', getVisaById);
router.post('/apply', createInquiry);

module.exports = router;
