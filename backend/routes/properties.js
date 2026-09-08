const express = require('express');
const router = express.Router();
const {
  getProperties,
  getStatsOverview,
  getPropertyById,
  getMyListings,
  updatePropertyStatus,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/stats/overview', getStatsOverview);
router.get('/user/my-listings', protect, getMyListings);
router.get('/:id', getPropertyById);
router.put('/:id/status', protect, updatePropertyStatus);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.get('/', getProperties);
router.post('/', optionalAuth, createProperty);

module.exports = router;
