const express = require('express');
const router = express.Router();
const Roommate = require('../models/Roommate');

// @route   GET /api/roommates
// @desc    Get all roommate and sublet matching posts
router.get('/', async (req, res) => {
  try {
    const { area, gender, maxBudget } = req.query;
    const filter = {};

    if (area && area !== 'All') filter.area = new RegExp(area, 'i');
    if (gender && gender !== 'All') filter.posterGender = gender;
    if (maxBudget) filter.budgetBDT = { $lte: Number(maxBudget) };

    const roommates = await Roommate.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: roommates.length, data: roommates });
  } catch (error) {
    console.error('Error fetching roommates:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/roommates
// @desc    Create a new roommate/sublet post
router.post('/', async (req, res) => {
  try {
    const post = await Roommate.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('Error creating roommate post:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
