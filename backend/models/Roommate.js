const mongoose = require('mongoose');

const roommateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    posterName: {
      type: String,
      required: true,
    },
    posterGender: {
      type: String,
      enum: ['Male', 'Female', 'Any'],
      required: true,
    },
    userType: {
      type: String,
      enum: ['University Student', 'Job Holder / Professional', 'Doctor / Engineer', 'Other'],
      default: 'University Student',
    },
    institutionOrCompany: {
      type: String,
      default: 'NSU / BRAC / Corporate',
    },
    area: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: 'Dhaka',
    },
    budgetBDT: {
      type: Number,
      required: true,
    },
    roomType: {
      type: String,
      enum: ['Single Master Bed', 'Single Attached Bath', 'Shared Room Seat', 'Drawing/Dining Partition', 'Entire Flat Share'],
      default: 'Single Attached Bath',
    },
    availableFrom: {
      type: String,
      default: 'Immediate',
    },
    habits: {
      smoking: { type: Boolean, default: false },
      studyFriendly: { type: Boolean, default: true },
      cookingShared: { type: Boolean, default: true },
      nightOwl: { type: Boolean, default: false },
    },
    contactPhone: {
      type: String,
      required: true,
    },
    contactWhatsApp: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Roommate', roommateSchema);
