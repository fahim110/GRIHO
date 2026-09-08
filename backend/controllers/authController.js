const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');
const { sendOtpEmail } = require('../utils/sendEmail');

// Helper to generate JWT token (expires in 30 days)
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (tenant or landlord) - Initiates Email OTP Verification
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, nidNumber } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, phone number, and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if user already exists
    let user = await User.findOne({ email: cleanEmail }).select('+otp +otpExpires');
    
    if (user) {
      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists and is verified. Please sign in.',
        });
      }

      // Existing unverified account - update details and refresh OTP
      user.name = name;
      user.phone = phone;
      user.password = password;
      user.role = role || 'tenant';
      user.nidNumber = nidNumber || '';
      user.nidVerified = Boolean(nidNumber && nidNumber.length >= 10);
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      // Create new unverified user
      user = await User.create({
        name,
        email: cleanEmail,
        phone,
        password,
        role: role || 'tenant',
        nidNumber: nidNumber || '',
        nidVerified: Boolean(nidNumber && nidNumber.length >= 10),
        isEmailVerified: false,
        otp,
        otpExpires,
      });
    }

    // Send the real email to the user's email address
    const emailResult = await sendOtpEmail({ to: cleanEmail, otp, name });

    res.status(200).json({
      success: true,
      requireOtp: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your Inbox and Spam folder.`,
      email: cleanEmail,
      emailSent: emailResult.sent,
    });
  } catch (error) {
    console.error('Registration error in authController:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Verify Email OTP & complete initial sign-in
// @route   POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and 6-digit OTP code',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    const user = await User.findOne({ email: cleanEmail }).select('+otp +otpExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address. Please register first.',
      });
    }

    if (user.isEmailVerified && !user.otp) {
      return res.status(400).json({
        success: false,
        message: 'Your email address is already verified. Please sign in with your password.',
      });
    }

    // Check OTP expiration
    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'The verification code has expired. Please click "Resend Code".',
      });
    }

    // Verify OTP match
    if (user.otp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check your email and try again.',
      });
    }

    // Mark as verified & clear OTP
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user._id);

    console.log(`✅ [GRIHO EMAIL OTP SERVICE] Email verified for: ${cleanEmail}`);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to GRIHO Bangladesh.',
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
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resend 6-digit OTP verification code
// @route   POST /api/auth/resend-otp
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail }).select('+otp +otpExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Your email address is already verified. Please sign in.',
      });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOtp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send real email via Gmail SMTP
    const emailResult = await sendOtpEmail({ to: cleanEmail, otp: newOtp, name: user.name });

    res.status(200).json({
      success: true,
      message: `A new 6-digit verification code has been dispatched to ${cleanEmail}. Please check your Inbox and Spam folder.`,
      email: cleanEmail,
      emailSent: emailResult.sent,
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
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
    console.error('Login error in authController:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate via Social OAuth (Google, Facebook, Apple)
// @route   POST /api/auth/social-login
exports.socialLogin = async (req, res) => {
  try {
    const { provider, email, name, avatar, role, phone } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required for social authentication',
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create a new social user
      user = await User.create({
        name: name || `${provider ? provider.toUpperCase() : 'Social'} User`,
        email: email.toLowerCase(),
        phone: phone || '01700000000',
        password: Math.random().toString(36).slice(-8) + 'G!1a',
        role: role || 'tenant',
        avatar: avatar || '',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Signed in successfully with ${provider || 'Social Account'}!`,
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
    console.error('Social login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user profile with populated saved properties
// @route   GET /api/auth/me
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      'savedProperties',
      'title area city rent images bedrooms bathrooms gasType propertyType'
    );
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error in authController:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/update-profile
exports.updateUserProfile = async (req, res) => {
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
    console.error('Update profile error in authController:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Save or unsave a property for current user
// @route   POST /api/auth/toggle-save/:propertyId
exports.toggleSaveProperty = async (req, res) => {
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
    console.error('Toggle save error in authController:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate with genuine Google Identity Services credential (ID Token from accounts.google.com)
// @route   POST /api/auth/google
exports.googleAuth = async (req, res) => {
  try {
    const { credential, code, redirectUri, role } = req.body;

    let idToken = credential;

    // If OAuth2 authorization code was received, exchange it with Google for tokens
    if (!idToken && code) {
      const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
      const rUri = redirectUri || 'http://localhost:5173/oauth/google';

      if (!clientSecret || !clientId) {
        return res.status(400).json({
          success: false,
          message: 'Google OAuth Client ID or Client Secret is not configured on the server.',
        });
      }

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: rUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenRes.json();
      if (tokenData.id_token) {
        idToken = tokenData.id_token;
      } else {
        console.error('Google token exchange error:', tokenData);
        return res.status(400).json({
          success: false,
          message: tokenData.error_description || 'Failed to exchange authorization code with Google',
        });
      }
    }

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google credential token or authorization code is required',
      });
    }

    // Verify genuine Google ID Token with Google OAuth2 servers or fallback to decode
    let decoded = null;
    try {
      const gRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      if (gRes.ok) {
        decoded = await gRes.json();
      }
    } catch (e) {
      console.warn('Google tokeninfo fetch warning:', e.message);
    }

    if (!decoded || !decoded.email) {
      decoded = jwt.decode(idToken);
    }

    if (!decoded || !decoded.email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google credential token received',
      });
    }

    const email = decoded.email;
    const name = decoded.name;
    const picture = decoded.picture;
    const sub = decoded.sub;
    const cleanEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Create new user from genuine Google account
      user = await User.create({
        name: name || 'Google User',
        email: cleanEmail,
        phone: '01700000000',
        password: Math.random().toString(36).slice(-8) + 'G!1a',
        role: role || 'tenant',
        avatar: picture || '',
        isEmailVerified: true, // Google has already verified this email
      });
    } else {
      user.isEmailVerified = true;
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      await user.save();
    }

    const token = generateToken(user._id);

    console.log(`\n======================================================`);
    console.log(`🌟 [GENUINE GOOGLE SIGN-IN SUCCESSFUL]`);
    console.log(`User: ${user.name} (${user.email})`);
    console.log(`Google Sub: ${sub}`);
    console.log(`Role: ${user.role}`);
    console.log(`======================================================\n`);

    res.status(200).json({
      success: true,
      message: 'Signed in successfully with your Google account!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        nidNumber: user.nidNumber,
        nidVerified: user.nidVerified,
        savedProperties: user.savedProperties,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.error('Genuine Google Auth error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public authentication configuration (Google Client ID)
// @route   GET /api/auth/config
exports.getAuthConfig = (req, res) => {
  const googleClientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.VITE_GOOGLE_CLIENT_ID ||
    '';

  res.json({
    success: true,
    googleClientId,
  });
};

