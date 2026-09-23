const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { notifyAdmins } = require('../services/notificationService');

const ensureEnquiryAccess = async (enquiry, user) => {
  if (user.role === 'ADMIN') return;
  if (user.role === 'USER' && enquiry.user.toString() === user.id.toString()) return;
  if (user.role === 'AGENT') {
    const property = await Property.findOne({ _id: enquiry.property, agent: user.id }).select('_id');
    if (property) return;
  }
  const error = new Error('Access denied');
  error.status = 403;
  throw error;
};

const getEnquiries = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'ADMIN') {
      if (req.query.property) filter.property = req.query.property;
      if (req.query.agent) filter.agent = req.query.agent;
      if (req.query.status) filter.status = req.query.status;
    }

    if (req.user.role === 'USER') {
      filter.user = req.user.id;
    } else if (req.user.role === 'AGENT') {
      const assignedProperties = await Property.find({ agent: req.user.id }).distinct('_id');
      filter.property = { $in: assignedProperties };
    }

    const enquiries = await Enquiry.find(filter)
      .populate('user', 'name email phone')
      .populate('property', 'title location price')
      .populate('agent', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('property', 'title location price')
      .populate('agent', 'name email phone');

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

      if (req.user.role === 'USER' && enquiry.user?._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await ensureEnquiryAccess(enquiry, req.user);

    res.json(enquiry);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const createEnquiry = async (req, res) => {
  try {
    const property = await Property.findById(req.body.property);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const enquiryData = {
      property: property._id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
      user: req.user.id,
      agent: property.agent,
      status: 'NEW'
    };

    const enquiry = await Enquiry.create(enquiryData);

    if (property.agent) {
      await Notification.create({
        user: property.agent,
        title: 'New Enquiry',
        message: `New enquiry received for ${property.title}`,
        type: 'ENQUIRY',
        relatedId: enquiry._id
      });
    }
    await notifyAdmins({
      title: 'New Enquiry Received',
      message: `A new enquiry was received for ${property.title}`,
      type: 'ENQUIRY',
      relatedId: enquiry._id
    });

    res.status(201).json(enquiry);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    await ensureEnquiryAccess(enquiry, req.user);
    const previousAgent = enquiry.agent?.toString();
    if (req.body.user !== undefined || req.body.property !== undefined) {
      return res.status(400).json({ message: 'Enquiry ownership cannot be changed' });
    }
    if (req.body.agent !== undefined) {
      if (req.user.role === 'AGENT') {
        return res.status(403).json({ message: 'Agents cannot assign enquiries' });
      }
      if (!req.body.agent) {
        enquiry.agent = undefined;
      } else {
      const agent = await User.findOne({ _id: req.body.agent, role: 'AGENT', isActive: true }).select('_id');
      if (!agent) return res.status(400).json({ message: 'Assigned agent is invalid' });
      enquiry.agent = agent._id;
      }
    }
    if (req.body.status !== undefined) enquiry.status = req.body.status;
    await enquiry.save();

    if (req.user.role === 'ADMIN' && enquiry.agent && enquiry.agent.toString() !== previousAgent) {
      await Notification.create({
        user: enquiry.agent,
        title: 'Enquiry Assigned',
        message: `An enquiry has been assigned to you for ${enquiry.property}`,
        type: 'ENQUIRY',
        relatedId: enquiry._id
      });
    }

    if (req.body.status && enquiry.user) {
      await Notification.create({
        user: enquiry.user,
        title: 'Enquiry Status Updated',
        message: `Your enquiry status has been updated to ${req.body.status}`,
        type: 'ENQUIRY',
        relatedId: enquiry._id
      });
    }

    res.json(enquiry);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    await ensureEnquiryAccess(enquiry, req.user);
    await Enquiry.findByIdAndDelete(req.params.id);

    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry
};
