const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: [true, 'Visit date is required']
  },
  time: {
    type: String,
    required: [true, 'Visit time is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED', 'REJECTED'],
    default: 'PENDING'
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

visitSchema.index(
  { property: 1, date: 1, time: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['PENDING', 'CONFIRMED', 'RESCHEDULED'] } } }
);
visitSchema.index(
  { agent: 1, date: 1, time: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['PENDING', 'CONFIRMED', 'RESCHEDULED'] } } }
);

module.exports = mongoose.model('Visit', visitSchema);
