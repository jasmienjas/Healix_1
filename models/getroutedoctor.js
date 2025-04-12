const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctorAvailabilityController');

// GET: Check availability with filters
router.get('/:doctorId', controller.getAvailability);

module.exports = router;

