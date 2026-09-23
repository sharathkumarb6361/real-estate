const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Unit = require('../models/Unit');
const Notification = require('../models/Notification');
const { notifyAdmins } = require('../services/notificationService');
const { publicError } = require('../utils/publicError');

const managementError = (status, message) => Object.assign(new Error(message), { status });

const getManageablePropertyIds = async (user) => {
  if (user.role !== 'AGENT') return null;
  return Property.find({ agent: user.id }).distinct('_id');
};

const assertBookingAccess = async (booking, user) => {
  if (user.role === 'ADMIN' || booking.user.toString() === user.id.toString()) return;
  if (user.role === 'AGENT') {
    const property = await Property.findOne({ _id: booking.property, agent: user.id }).select('_id');
    if (property) return;
  }
  throw managementError(403, 'You are not authorized to manage this booking');
};

const getBookings = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'USER') {
      filter.user = req.user.id;
    } else if (req.user.role === 'AGENT') {
      filter.property = { $in: await getManageablePropertyIds(req.user) };
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('property', 'title location price')
      .populate('unit', 'unitNumber bhk area price')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

const createBooking = async (req, res) => {
  let reservedUnitId;
  try {
    const property = await Property.findById(req.body.property);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (req.body.paymentStatus !== undefined || req.body.amount !== undefined || req.body.status !== undefined) {
      throw managementError(400, 'Amount, payment status, and booking status are managed by the server');
    }

    let amount = property.price;
    if (req.body.unit) {
      const unit = await Unit.findById(req.body.unit).select('property price status');
      if (!unit) throw managementError(404, 'Unit not found');
      if (unit.property.toString() !== property._id.toString()) {
        throw managementError(400, 'Selected unit does not belong to this property');
      }

      const reservedUnit = await Unit.findOneAndUpdate(
        { _id: unit._id, property: property._id, status: 'AVAILABLE' },
        { $set: { status: 'RESERVED' } },
        { new: true }
      );
      if (!reservedUnit) throw managementError(409, 'Unit is no longer available');
      reservedUnitId = reservedUnit._id;
      amount = unit.price;
    }

    const bookingData = {
      property: property._id,
      unit: reservedUnitId,
      bookingDate: req.body.bookingDate,
      amount,
      notes: req.body.notes,
      user: req.user.id,
      status: 'PENDING',
      paymentStatus: 'PENDING'
    };

    const booking = await Booking.create(bookingData);

    try {
      await Notification.create({
        user: req.user.id,
        title: 'Booking Request Submitted',
        message: `Your booking request for ${property.title} has been submitted`,
        type: 'BOOKING',
        relatedId: booking._id
      });
      if (property.agent && property.agent.toString() !== req.user.id.toString()) {
        await Notification.create({
          user: property.agent,
          title: 'New Booking Request',
          message: `New booking request received for ${property.title}`,
          type: 'BOOKING',
          relatedId: booking._id
        });
      }
      await notifyAdmins({
        title: 'New Booking Request',
        message: `A new booking request was received for ${property.title}`,
        type: 'BOOKING',
        relatedId: booking._id
      });
    } catch (notificationError) {
      console.error('Booking notification failed:', notificationError.message);
    }

    res.status(201).json(booking);
  } catch (error) {
    if (reservedUnitId) {
      await Unit.findOneAndUpdate({ _id: reservedUnitId, status: 'RESERVED' }, { $set: { status: 'AVAILABLE' } });
    }
    res.status(error.status || 500).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await assertBookingAccess(booking, req.user);
    if (req.body.paymentStatus !== undefined || req.body.amount !== undefined || req.body.user !== undefined || req.body.property !== undefined || req.body.unit !== undefined) {
      throw managementError(400, 'Payment status, amount, ownership, property, and unit cannot be changed here');
    }

    const nextStatus = req.body.status;
    if (req.user.role === 'USER' && nextStatus && nextStatus !== 'CANCELLED' && nextStatus !== booking.status) {
      throw managementError(403, 'Users can only cancel their own bookings');
    }

    const allowedTransitions = {
      PENDING: ['APPROVED', 'REJECTED', 'CANCELLED'],
      APPROVED: ['COMPLETED', 'CANCELLED'],
      REJECTED: [],
      CANCELLED: [],
      COMPLETED: []
    };
    if (nextStatus && nextStatus !== booking.status && !allowedTransitions[booking.status]?.includes(nextStatus)) {
      throw managementError(400, 'Invalid booking status transition');
    }

    if (nextStatus && nextStatus !== booking.status && nextStatus === 'APPROVED' && booking.unit) {
      const unit = await Unit.findOneAndUpdate(
        { _id: booking.unit, status: 'RESERVED' },
        { $set: { status: 'BOOKED' } },
        { new: true }
      );
      if (!unit) throw managementError(409, 'Reserved unit is no longer available for approval');
    }

    if (nextStatus && nextStatus !== booking.status && (nextStatus === 'REJECTED' || nextStatus === 'CANCELLED') && booking.unit) {
      await Unit.findOneAndUpdate({ _id: booking.unit, status: 'RESERVED' }, { $set: { status: 'AVAILABLE' } });
    }

    if (nextStatus && nextStatus !== booking.status && nextStatus === 'COMPLETED' && booking.unit) {
      const unit = await Unit.findOneAndUpdate(
        { _id: booking.unit, status: 'BOOKED' },
        { $set: { status: 'SOLD' } },
        { new: true }
      );
      if (!unit) throw managementError(409, 'Booked unit is required before completion');
    }

    if (nextStatus) booking.status = nextStatus;
    if (req.body.notes !== undefined) booking.notes = req.body.notes;
    await booking.save();

    if (req.body.status && booking.user) {
      await Notification.create({
        user: booking.user,
        title: 'Booking Status Updated',
        message: `Your booking status has been updated to ${req.body.status}`,
        type: 'BOOKING',
        relatedId: booking._id
      });
    }

    if (req.body.status) {
      const property = await Property.findById(booking.property).select('title agent');
      if (property?.agent && property.agent.toString() !== req.user.id.toString()) {
        await Notification.create({
          user: property.agent,
          title: 'Booking Status Updated',
          message: `Booking status for ${property.title} changed to ${req.body.status}`,
          type: 'BOOKING',
          relatedId: booking._id
        });
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const verifyBookingPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (!['APPROVED', 'COMPLETED'].includes(booking.status)) {
      return res.status(409).json({ message: 'Booking must be approved or completed before payment verification' });
    }
    if (booking.paymentStatus === 'PAID') return res.status(409).json({ message: 'Payment is already verified' });
    booking.paymentStatus = 'PAID';
    await booking.save();
    await Notification.create({
      user: booking.user,
      title: 'Payment Verification Completed',
      message: 'Payment for your booking has been verified successfully.',
      type: 'PAYMENT',
      relatedId: booking._id
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

module.exports = { getBookings, createBooking, updateBooking, verifyBookingPayment };
