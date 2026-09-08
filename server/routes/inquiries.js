const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @route   POST /api/inquiries
// @desc    Submit a new visit booking or inquiry
router.post('/', async (req, res) => {
  try {
    const {
      propertyId,
      name,
      phone,
      email,
      tenantType,
      preferredVisitDate,
      preferredVisitTime,
      message,
    } = req.body;

    if (!propertyId || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID, your name, and phone number',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const inquiry = await Inquiry.create({
      property: property._id,
      propertyTitle: property.title,
      name,
      phone,
      email,
      tenantType: tenantType || 'Family',
      preferredVisitDate,
      preferredVisitTime,
      message: message || 'I would like to schedule a physical tour of this flat.',
    });

    res.status(201).json({
      success: true,
      message: 'Your visit request has been sent to the property owner successfully!',
      data: inquiry,
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/inquiries
// @desc    Get all inquiries (for host/admin dashboard)
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('property', 'title area rent images contactName contactPhone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    console.error('Error getting inquiries:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
