const Visit = require('../models/Visit');
const Property = require('../models/Property');
const Notification = require('../models/Notification');
const { notifyAdmins } = require('../services/notificationService');

const visitError = (status, message) => Object.assign(new Error(message), { status });

const sendVisitError = (res, error) => {
  if (error.code === 11000) return res.status(409).json({ message: 'This property or agent already has a visit at that time' });
  if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
  return res.status(error.status || 500).json({ message: error.message });
};

const normalizeDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw visitError(400, 'Invalid visit date');
  date.setHours(0, 0, 0, 0);
  if (date < new Date(new Date().setHours(0, 0, 0, 0))) throw visitError(400, 'Visit date cannot be in the past');
  return date;
};

const assertNoConflict = async ({ property, agent, date, time, excludeId }) => {
  const filter = {
    date,
    time,
    status: { $in: ['PENDING', 'CONFIRMED', 'RESCHEDULED'] },
    $or: [{ property }]
  };
  if (agent) filter.$or.push({ agent });
  if (excludeId) filter._id = { $ne: excludeId };
  const conflict = await Visit.findOne(filter).select('_id');
  if (conflict) throw visitError(409, 'This property or agent already has a visit at that time');
};

const ensureVisitAccess = async (visit, user) => {
  if (user.role === 'ADMIN') return;
  if (user.role === 'USER' && visit.user.toString() === user.id.toString()) return;
  if (user.role === 'AGENT') {
    const property = await Property.findOne({ _id: visit.property, agent: user.id }).select('_id');
    if (property) return;
  }
  const error = new Error('Access denied');
  error.status = 403;
  throw error;
};

const getVisits = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'USER') {
      filter.user = req.user.id;
    } else if (req.user.role === 'AGENT') {
      const assignedProperties = await Property.find({ agent: req.user.id }).distinct('_id');
      filter.property = { $in: assignedProperties };
    }

    const visits = await Visit.find(filter)
      .populate('user', 'name email phone')
      .populate('property', 'title location')
      .populate('agent', 'name email phone')
      .sort({ date: -1 });

    res.json(visits);
  } catch (error) {
    sendVisitError(res, error);
  }
};

const createVisit = async (req, res) => {
  try {
    const property = await Property.findById(req.body.property);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const date = normalizeDate(req.body.date);
    if (!req.body.time || !req.body.name || !req.body.phone) {
      throw visitError(400, 'Date, time, name, and phone are required');
    }
    await assertNoConflict({ property: property._id, agent: property.agent, date, time: req.body.time });

    const visitData = {
      property: property._id,
      date,
      time: req.body.time,
      name: req.body.name,
      phone: req.body.phone,
      message: req.body.message,
      user: req.user.id,
      agent: property.agent
    };

    const visit = await Visit.create(visitData);

    if (property.agent) {
      await Notification.create({
        user: property.agent,
        title: 'New Visit Scheduled',
        message: `New visit scheduled for ${property.title}`,
        type: 'VISIT',
        relatedId: visit._id
      });
    }
    await notifyAdmins({
      title: 'New Site Visit Requested',
      message: `A new site visit was requested for ${property.title}`,
      type: 'VISIT',
      relatedId: visit._id
    });

    res.status(201).json(visit);
  } catch (error) {
    sendVisitError(res, error);
  }
};

const updateVisit = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    await ensureVisitAccess(visit, req.user);
    if (req.body.user !== undefined || req.body.property !== undefined || req.body.agent !== undefined) {
      return res.status(400).json({ message: 'Visit ownership cannot be changed' });
    }
    const nextStatus = req.body.status || visit.status;
    if (req.user.role === 'USER' && nextStatus !== 'CANCELLED' && nextStatus !== visit.status) {
      throw visitError(403, 'Users can only cancel their own visits');
    }
    if (!['PENDING', 'CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED', 'REJECTED'].includes(nextStatus)) {
      throw visitError(400, 'Invalid visit status');
    }
    const nextDate = req.body.date === undefined ? visit.date : normalizeDate(req.body.date);
    const nextTime = req.body.time === undefined ? visit.time : req.body.time;
    if (nextDate.getTime() !== new Date(visit.date).setHours(0, 0, 0, 0) || nextTime !== visit.time) {
      await assertNoConflict({ property: visit.property, agent: visit.agent, date: nextDate, time: nextTime, excludeId: visit._id });
      if (req.user.role !== 'ADMIN' && req.user.role !== 'AGENT') {
        throw visitError(403, 'Only agents or admins can reschedule visits');
      }
      visit.status = 'RESCHEDULED';
    }
    if (req.body.status !== undefined) visit.status = nextStatus;
    visit.date = nextDate;
    visit.time = nextTime;
    if (req.body.message !== undefined) visit.message = req.body.message;
    await visit.save();

    if (req.body.status && visit.user) {
      const statusTitles = {
        CONFIRMED: 'Site Visit Approved',
        REJECTED: 'Site Visit Rejected',
        RESCHEDULED: 'Site Visit Rescheduled',
        COMPLETED: 'Site Visit Completed',
        CANCELLED: 'Site Visit Cancelled'
      };
      await Notification.create({
        user: visit.user,
        title: statusTitles[req.body.status] || 'Visit Status Updated',
        message: `Your visit status has been updated to ${req.body.status}`,
        type: 'VISIT',
        relatedId: visit._id
      });
    }

    res.json(visit);
  } catch (error) {
    sendVisitError(res, error);
  }
};

module.exports = { getVisits, createVisit, updateVisit };
