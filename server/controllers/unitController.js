const Unit = require('../models/Unit');
const Property = require('../models/Property');
const { publicError } = require('../utils/publicError');

const sendUnitError = (res, error) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Please correct the unit fields',
      errors: Object.values(error.errors).map(fieldError => ({
        field: fieldError.path,
        message: fieldError.message
      }))
    });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${error.path}` });
  }
  return res.status(500).json({ message: publicError(error) });
};

const findDuplicateUnit = async ({ property, block, unitNumber, excludeId }) => {
  if (!unitNumber) return null;
  const query = { property, block: block ? block.trim() : '', unitNumber: unitNumber.trim() };
  if (excludeId) query._id = { $ne: excludeId };
  return Unit.findOne(query);
};

const ensurePropertyAccess = async (propertyId, user) => {
  const property = await Property.findById(propertyId);
  if (!property) return null;
  if (user.role === 'AGENT' && property.agent?.toString() !== user.id.toString()) {
    const error = new Error('You can only manage units for assigned properties');
    error.status = 403;
    throw error;
  }
  return property;
};

const getUnits = async (req, res) => {
  try {
    const { property } = req.query;
    const filter = property ? { property } : {};
    if (req.user?.role === 'AGENT') {
      const assignedProperties = await Property.find({ agent: req.user.id }).distinct('_id');
      filter.property = property
        ? { $in: assignedProperties.filter(id => id.toString() === property) }
        : { $in: assignedProperties };
    }

    const units = await Unit.find(filter).populate('property', 'title location city');
    res.json(units);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const createUnit = async (req, res) => {
  try {
    if (!req.body.property) {
      return res.status(400).json({ message: 'Property is required' });
    }

    const property = await ensurePropertyAccess(req.body.property, req.user);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const duplicate = await findDuplicateUnit(req.body);
    if (duplicate) {
      return res.status(409).json({ message: 'Unit number already exists in this property and block' });
    }

    const unit = await Unit.create(req.body);
    res.status(201).json(unit);
  } catch (error) {
    sendUnitError(res, error);
  }
};

const updateUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const propertyId = req.body.property || unit.property;
    const property = await ensurePropertyAccess(propertyId, req.user);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const duplicate = await findDuplicateUnit({
      property: propertyId,
      block: req.body.block === undefined ? unit.block : req.body.block,
      unitNumber: req.body.unitNumber || unit.unitNumber,
      excludeId: unit._id
    });
    if (duplicate) {
      return res.status(409).json({ message: 'Unit number already exists in this property and block' });
    }

    Object.assign(unit, req.body, { property: propertyId });
    await unit.save();

    res.json(unit);
  } catch (error) {
    sendUnitError(res, error);
  }
};

const deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    await ensurePropertyAccess(unit.property, req.user);
    await Unit.findByIdAndDelete(req.params.id);

    res.json({ message: 'Unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

module.exports = { getUnits, createUnit, updateUnit, deleteUnit };
