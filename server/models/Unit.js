const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  unitNumber: {
    type: String,
    required: [true, 'Unit number is required'],
    trim: true
  },
  block: {
    type: String,
    trim: true
  },
  floor: {
    type: Number,
    min: [0, 'Floor cannot be negative']
  },
  bhk: {
    type: Number,
    required: [true, 'BHK is required'],
    min: [0, 'BHK cannot be negative']
  },
  area: {
    type: Number,
    required: [true, 'Area is required'],
    min: [1, 'Area must be greater than 0']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price must be greater than 0']
  },
  facing: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'RESERVED', 'BOOKED', 'SOLD'],
    default: 'AVAILABLE'
  },
  bedrooms: {
    type: Number,
    default: 0
  },
  bathrooms: {
    type: Number,
    default: 0
  },
  parking: {
    type: Number,
    default: 0,
    min: [0, 'Parking cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Unit', unitSchema);
