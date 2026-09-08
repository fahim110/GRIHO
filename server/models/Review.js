const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    authorName: {
      type: String,
      required: [true, 'Please provide reviewer name'],
      trim: true,
    },
    authorRole: {
      type: String,
      enum: ['Tenant', 'Former Tenant', 'Visitor', 'Verified Resident'],
      default: 'Tenant',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    safetyRating: {
      type: Number,
      default: 5,
    },
    gasWaterRating: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
