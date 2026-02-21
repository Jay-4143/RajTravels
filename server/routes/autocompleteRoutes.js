/**
 * Autocomplete Routes
 * /api/autocomplete/*
 */

const express = require('express');
const router = express.Router();
const autocompleteController = require('../controllers/autocompleteController');

router.get('/locations', autocompleteController.searchLocations);

module.exports = router;
