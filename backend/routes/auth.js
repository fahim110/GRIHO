const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  socialLogin,
  googleAuth,
  getUserProfile,
  updateUserProfile,
  toggleSaveProperty,
  getAuthConfig,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.get('/config', getAuthConfig);
router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.post('/social-login', socialLogin);
router.post('/google', googleAuth);
router.get('/me', protect, getUserProfile);
router.put('/update-profile', protect, updateUserProfile);
router.post('/toggle-save/:propertyId', protect, toggleSaveProperty);

module.exports = router;

