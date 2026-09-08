const express = require('express');
const router = express.Router();
const { generateLeaseAgreement } = require('../controllers/leaseController');

router.post('/generate', generateLeaseAgreement);

module.exports = router;
