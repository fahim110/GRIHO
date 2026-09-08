const express = require('express');
const router = express.Router();
const {
  getPropertyReviews,
  createReview,
} = require('../controllers/reviewController');

router.get('/property/:propertyId', getPropertyReviews);
router.post('/', createReview);

module.exports = router;
