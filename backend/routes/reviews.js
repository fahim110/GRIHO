const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Property = require('../models/Property');

// @route   GET /api/reviews/property/:propertyId
// @desc    Get all reviews for a property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/reviews
// @desc    Submit a review for a property
router.post('/', async (req, res) => {
  try {
    const { propertyId, authorName, authorRole, rating, comment, safetyRating, gasWaterRating } = req.body;

    if (!propertyId || !authorName || !comment || !rating) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const review = await Review.create({
      property: propertyId,
      authorName,
      authorRole: authorRole || 'Verified Resident',
      rating: Number(rating),
      comment,
      safetyRating: Number(safetyRating || 5),
      gasWaterRating: Number(gasWaterRating || 5),
    });

    // Update property rating and review count
    const propertyReviews = await Review.find({ property: propertyId });
    const avgRating = propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length;

    await Property.findByIdAndUpdate(propertyId, {
      rating: Number(avgRating.toFixed(1)),
      reviewCount: propertyReviews.length,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
