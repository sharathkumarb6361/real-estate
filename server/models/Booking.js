const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit'
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be greater than 0']
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING'
  },
  notes: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'REFUNDED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
