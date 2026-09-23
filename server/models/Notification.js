const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  type: {
    type: String,
    enum: ['ENQUIRY', 'VISIT', 'BOOKING', 'PAYMENT', 'GENERAL'],
    default: 'GENERAL'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
