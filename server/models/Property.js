const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
      maxlength: [160, 'Title cannot be more than 160 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed property description'],
    },
    propertyType: {
      type: String,
      required: true,
      enum: [
        'Family Apartment',
        'Bachelor Sublet',
        'Mess / Room',
        'Studio Flat',
        'Duplex House',
        'Commercial Space',
      ],
      default: 'Family Apartment',
    },
    division: {
      type: String,
      required: true,
      default: 'Dhaka',
    },
    city: {
      type: String,
      required: true,
      default: 'Dhaka',
    },
    area: {
      type: String,
      required: [true, 'Please specify the neighborhood/area (e.g., Gulshan, Dhanmondi)'],
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    rent: {
      type: Number,
      required: [true, 'Monthly rent in BDT is required'],
      min: [0, 'Rent cannot be negative'],
    },
    serviceCharge: {
      type: Number,
      default: 0,
      min: [0, 'Service charge cannot be negative'],
    },
    advanceDepositMonths: {
      type: Number,
      default: 2,
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 1,
      default: 2,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 1,
      default: 2,
    },
    balconies: {
      type: Number,
      default: 1,
      min: 0,
    },
    sizeSqFt: {
      type: Number,
      required: true,
      min: 50,
    },
    floor: {
      type: String,
      default: '3rd Floor',
    },
    facing: {
      type: String,
      enum: ['South', 'North', 'East', 'West', 'South-East', 'South-West', 'North-East', 'North-West'],
      default: 'South',
    },
    gasType: {
      type: String,
      enum: ['Titas Line Gas', 'Cylinder (LPG)', 'Induction/Electric', 'None'],
      default: 'Titas Line Gas',
    },
    electricityType: {
      type: String,
      enum: ['Prepaid Meter', 'Postpaid Meter'],
      default: 'Prepaid Meter',
    },
    amenities: {
      generatorBackup: { type: Boolean, default: true },
      lift: { type: Boolean, default: true },
      guard247: { type: Boolean, default: true },
      cctv: { type: Boolean, default: true },
      carParking: { type: Boolean, default: false },
      rooftopAccess: { type: Boolean, default: true },
      servantRoom: { type: Boolean, default: false },
      wifiAvailable: { type: Boolean, default: true },
      geyser: { type: Boolean, default: true },
    },
    tenantPolicy: {
      type: String,
      enum: [
        'Family Only',
        'Bachelor (Male)',
        'Bachelor (Female)',
        'Bachelor & Family',
        'Students Only',
        'Any',
      ],
      default: 'Family Only',
    },
    availableFrom: {
      type: String,
      default: 'Immediate',
    },
    contactName: {
      type: String,
      required: true,
      default: 'Property Owner',
    },
    contactPhone: {
      type: String,
      required: true,
      default: '+8801700000000',
    },
    contactWhatsApp: {
      type: String,
      default: '+8801700000000',
    },
    images: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 8,
    },
    status: {
      type: String,
      enum: ['Available', 'Booked', 'Under Negotiation'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for fast search across title, description, area, address
propertySchema.index({ title: 'text', description: 'text', area: 'text', address: 'text', city: 'text' });

module.exports = mongoose.model('Property', propertySchema);
