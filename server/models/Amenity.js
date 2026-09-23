const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Amenity name is required'],
    unique: true,
    trim: true
  },
  icon: {
    type: String
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Amenity', amenitySchema);
