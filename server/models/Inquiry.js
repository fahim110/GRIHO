const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    propertyTitle: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    tenantType: {
      type: String,
      enum: ['Family', 'Bachelor (Male)', 'Bachelor (Female)', 'Student', 'Corporate / Company', 'Other'],
      default: 'Family',
    },
    preferredVisitDate: {
      type: String,
    },
    preferredVisitTime: {
      type: String,
    },
    message: {
      type: String,
      default: 'I am interested in this rental property and would like to arrange a physical visit.',
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Scheduled', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
