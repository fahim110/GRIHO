const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Submit a new visit booking or inquiry
// @route   POST /api/inquiries
exports.createInquiry = async (req, res) => {
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
      name: req.user ? req.user.name : name,
      phone: req.user ? req.user.phone : phone,
      email: req.user ? req.user.email : email,
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
    console.error('Error in inquiryController createInquiry:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get inquiries for the current logged-in user (both sent as tenant & received as landlord)
// @route   GET /api/inquiries/my-inquiries
exports.getMyInquiries = async (req, res) => {
  try {
    const userPhone = req.user.phone;
    const userEmail = req.user.email;

    // Properties owned by user
    const myProperties = await Property.find({
      $or: [
        { createdBy: req.user._id },
        { contactPhone: userPhone },
      ],
    }).select('_id');
    const myPropertyIds = myProperties.map((p) => p._id);

    // Inquiries where user is the tenant OR inquiries on user's properties
    const inquiries = await Inquiry.find({
      $or: [
        { phone: userPhone },
        { email: userEmail },
        { property: { $in: myPropertyIds } },
      ],
    })
      .populate('property', 'title area rent contactName contactPhone propertyType')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    console.error('Error in inquiryController getMyInquiries:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id/status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Error in inquiryController updateInquiryStatus:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries (admin/general)
// @route   GET /api/inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('property', 'title area rent contactName contactPhone propertyType')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    console.error('Error in inquiryController getAllInquiries:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
