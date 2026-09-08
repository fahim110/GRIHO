const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, JWT_SECRET } = require('../middleware/auth');

// Helper to generate JWT token (expires in 30 days)
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user (tenant or landlord)
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, nidNumber } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, phone number, and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please login.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: role || 'tenant',
      nidNumber: nidNumber || '',
      nidVerified: Boolean(nidNumber && nidNumber.length >= 10),
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        nidNumber: user.nidNumber,
        nidVerified: user.nidVerified,
        savedProperties: user.savedProperties,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user by email and include password for validation
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        nidNumber: user.nidNumber,
        nidVerified: user.nidVerified,
        savedProperties: user.savedProperties,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user profile with populated saved properties
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      'savedProperties',
      'title area city rent images bedrooms bathrooms gasType propertyType'
    );
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile details
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, phone, nidNumber, role, avatar } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (nidNumber) {
      user.nidNumber = nidNumber;
      user.nidVerified = nidNumber.length >= 10;
    }
    if (role) user.role = role;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        nidNumber: user.nidNumber,
        nidVerified: user.nidVerified,
        savedProperties: user.savedProperties,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/toggle-save/:propertyId
// @desc    Save or unsave a property for current user
router.post('/toggle-save/:propertyId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const propertyId = req.params.propertyId;

    const index = user.savedProperties.indexOf(propertyId);
    let isSaved = false;

    if (index > -1) {
      user.savedProperties.splice(index, 1);
      isSaved = false;
    } else {
      user.savedProperties.push(propertyId);
      isSaved = true;
    }

    await user.save();

    res.json({
      success: true,
      isSaved,
      savedProperties: user.savedProperties,
    });
  } catch (error) {
    console.error('Toggle save error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
