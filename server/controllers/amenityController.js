const Amenity = require('../models/Amenity');
const Property = require('../models/Property');
const { publicError } = require('../utils/publicError');

const sendAmenityError = (res, error) => {
  if (error.code === 11000) return res.status(409).json({ message: 'Amenity name already exists' });
  if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
  return res.status(500).json({ message: publicError(error) });
};

const getAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find().sort({ name: 1 });
    res.json(amenities);
  } catch (error) {
    sendAmenityError(res, error);
  }
};

const createAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.create(req.body);
    res.status(201).json(amenity);
  } catch (error) {
    sendAmenityError(res, error);
  }
};

const updateAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!amenity) return res.status(404).json({ message: 'Amenity not found' });
    res.json(amenity);
  } catch (error) {
    sendAmenityError(res, error);
  }
};

const deleteAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndDelete(req.params.id);
    if (!amenity) return res.status(404).json({ message: 'Amenity not found' });
    await Property.updateMany({ amenities: amenity._id }, { $pull: { amenities: amenity._id } });
    res.json({ message: 'Amenity deleted successfully' });
  } catch (error) {
    sendAmenityError(res, error);
  }
};

module.exports = { getAmenities, createAmenity, updateAmenity, deleteAmenity };
