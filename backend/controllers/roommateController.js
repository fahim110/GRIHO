const Roommate = require('../models/Roommate');

// @desc    Get all roommate and sublet matching posts
// @route   GET /api/roommates
exports.getRoommates = async (req, res) => {
  try {
    const { area, gender, maxBudget } = req.query;
    const filter = {};

    if (area && area !== 'All') filter.area = new RegExp(area, 'i');
    if (gender && gender !== 'All') filter.posterGender = gender;
    if (maxBudget) filter.budgetBDT = { $lte: Number(maxBudget) };

    const roommates = await Roommate.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: roommates.length, data: roommates });
  } catch (error) {
    console.error('Error in roommateController getRoommates:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new roommate/sublet post
// @route   POST /api/roommates
exports.createRoommatePost = async (req, res) => {
  try {
    const post = await Roommate.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('Error in roommateController createRoommatePost:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};
