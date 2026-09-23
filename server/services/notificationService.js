const User = require('../models/User');
const Notification = require('../models/Notification');

const notifyAdmins = async ({ title, message, type, relatedId }) => {
  const admins = await User.find({ role: 'ADMIN', isActive: true }).select('_id');
  if (admins.length === 0) return;
  await Notification.insertMany(admins.map(admin => ({
    user: admin._id,
    title,
    message,
    type,
    relatedId
  })));
};

module.exports = { notifyAdmins };
