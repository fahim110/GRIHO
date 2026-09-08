const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getMyInquiries,
  updateInquiryStatus,
  getAllInquiries,
} = require('../controllers/inquiryController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/my-inquiries', protect, getMyInquiries);
router.put('/:id/status', protect, updateInquiryStatus);
router.post('/', optionalAuth, createInquiry);
router.get('/', getAllInquiries);

module.exports = router;
