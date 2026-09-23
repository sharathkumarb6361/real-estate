const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price must be greater than 0']
  },
  propertyType: {
    type: String,
    enum: ['APARTMENT', 'VILLA', 'HOUSE', 'COMMERCIAL', 'PLOT'],
    required: [true, 'Property type is required']
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
  bedrooms: {
    type: Number,
    required: [true, 'Bedrooms count is required'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Bathrooms count is required'],
    min: [0, 'Bathrooms cannot be negative']
  },
  floor: {
    type: Number,
    min: [0, 'Floor cannot be negative']
  },
  totalFloors: {
    type: Number,
    min: [0, 'Total floors cannot be negative']
  },
  parking: {
    type: Number,
    default: 0,
    min: [0, 'Parking cannot be negative']
  },
  amenities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  images: [{
    type: String
  }],
  coverImage: {
    type: String
  },
  floorPlan: {
    type: String
  },
  possessionDate: {
    type: Date
  },
  constructionYear: {
    type: Number,
    min: [0, 'Construction year cannot be negative']
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'RESERVED', 'BOOKED', 'SOLD'],
    default: 'AVAILABLE'
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  nearbyFacilities: {
    school: String,
    hospital: String,
    shopping: String,
    transportation: String
  },
  isProject: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
