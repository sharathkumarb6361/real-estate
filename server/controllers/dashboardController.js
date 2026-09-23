const Property = require('../models/Property');
const Unit = require('../models/Unit');
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');
const Visit = require('../models/Visit');
const Booking = require('../models/Booking');
const { publicError } = require('../utils/publicError');

const getStats = async (req, res) => {
  try {
    const [
      totalProperties,
      availableUnits,
      reservedUnits,
      bookedUnits,
      soldUnits,
      totalUsers,
      totalAgents,
      totalEnquiries,
      totalVisits,
      totalBookings,
      pendingVisits,
      pendingBookings,
      verifiedRevenue
    ] = await Promise.all([
      Property.countDocuments(),
      Unit.countDocuments({ status: 'AVAILABLE' }),
      Unit.countDocuments({ status: 'RESERVED' }),
      Unit.countDocuments({ status: 'BOOKED' }),
      Unit.countDocuments({ status: 'SOLD' }),
      User.countDocuments({ role: 'USER' }),
      User.countDocuments({ role: 'AGENT' }),
      Enquiry.countDocuments(),
      Visit.countDocuments(),
      Booking.countDocuments(),
      Visit.countDocuments({ status: 'PENDING' }),
      Booking.countDocuments({ status: 'PENDING' }),
      Booking.aggregate([
        { $match: { paymentStatus: 'PAID', status: { $in: ['APPROVED', 'COMPLETED'] }, amount: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      totalProperties,
      availableUnits,
      reservedUnits,
      bookedUnits,
      soldUnits,
      totalUsers,
      totalAgents,
      totalEnquiries,
      totalVisits,
      totalBookings,
      pendingVisits,
      pendingBookings,
      verifiedRevenue: verifiedRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const propertiesByType = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', count: 1 } },
      { $sort: { name: 1 } }
    ]);

    const monthlyEnquiries = await Enquiry.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, label: '$_id', count: 1 } },
      { $sort: { label: 1 } }
    ]);

    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, label: '$_id', count: 1 } },
      { $sort: { label: 1 } }
    ]);

    const unitAvailability = await Unit.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const revenueOverTime = await Booking.aggregate([
      { $match: { paymentStatus: 'PAID', status: { $in: ['APPROVED', 'COMPLETED'] }, amount: { $gt: 0 } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$amount' }
        }
      },
      { $project: { _id: 0, label: '$_id', revenue: 1 } },
      { $sort: { label: 1 } }
    ]);

    res.json({
      propertiesByType,
      monthlyEnquiries,
      monthlyBookings,
      unitAvailability,
      revenueOverTime
    });
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

module.exports = { getStats, getAnalytics };
