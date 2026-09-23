const Property = require('../models/Property');
const Unit = require('../models/Unit');
const Amenity = require('../models/Amenity');

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const { uploadImage } = require('../services/imageStorage');
const { publicError } = require('../utils/publicError');

const sendPropertyError = (res, error) => {
  if (error.status) return res.status(error.status).json({ message: error.message });
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Please correct the property fields',
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

const validateAmenities = async (amenityIds) => {
  if (amenityIds === undefined) return;
  if (!Array.isArray(amenityIds)) throw Object.assign(new Error('Amenities must be an array'), { status: 400 });
  const uniqueIds = [...new Set(amenityIds.map(String))];
  const count = await Amenity.countDocuments({ _id: { $in: uniqueIds } });
  if (count !== uniqueIds.length) throw Object.assign(new Error('One or more amenities do not exist'), { status: 400 });
};

const getProperties = async (req, res) => {
  try {
    const {
      location,
      propertyType,
      bhk,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      bathrooms,
      parking,
      status,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    if (req.user?.role === 'AGENT') {
      filter.agent = req.user.id;
    }

    if (location) {
      filter.$or = [
        { location: { $regex: escapeRegex(location), $options: 'i' } },
        { city: { $regex: escapeRegex(location), $options: 'i' } }
      ];
    }

    if (propertyType) filter.propertyType = propertyType;
    if (bhk) filter.bhk = parseInt(bhk);
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (minArea) filter.area = { ...filter.area, $gte: parseFloat(minArea) };
    if (maxArea) filter.area = { ...filter.area, $lte: parseFloat(maxArea) };
    if (bedrooms) filter.bedrooms = parseInt(bedrooms);
    if (bathrooms) filter.bathrooms = parseInt(bathrooms);
    if (parking) filter.parking = parseInt(parking);
    if (status) filter.status = status;

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const properties = await Property.find(filter)
      .populate('agent', 'name email phone')
      .populate('amenities')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'name email phone')
      .populate('amenities');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (req.user?.role === 'AGENT' && property.agent?.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to access this property' });
    }

    const units = await Unit.find({ property: req.params.id });

    res.json({ ...property.toObject(), units });
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

const createProperty = async (req, res) => {
  try {
    await validateAmenities(req.body.amenities);
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    sendPropertyError(res, error);
  }
};

const updateProperty = async (req, res) => {
  try {
    if (req.user.role === 'AGENT') {
      const assignedProperty = await Property.findOne({ _id: req.params.id, agent: req.user.id }).select('_id');
      if (!assignedProperty) {
        return res.status(403).json({ message: 'You can only update assigned properties' });
      }
      if (req.body.agent !== undefined && req.body.agent.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Agents cannot reassign properties' });
      }
    }

    await validateAmenities(req.body.amenities);

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    sendPropertyError(res, error);
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await Unit.deleteMany({ property: req.params.id });

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

const uploadPropertyImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image file is required' });
    }

    const images = await Promise.all(req.files.map(uploadImage));
    res.status(201).json({ images });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const removePropertyImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (req.user.role === 'AGENT' && property.agent?.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You can only manage images for assigned properties' });
    }

    if (!imageUrl || !property.images.includes(imageUrl)) {
      return res.status(404).json({ message: 'Image not found on property' });
    }

    property.images = property.images.filter(image => image !== imageUrl);
    if (property.coverImage === imageUrl) {
      property.coverImage = property.images[0];
    }
    await property.save();
    res.json({ images: property.images, coverImage: property.coverImage });
  } catch (error) {
    sendPropertyError(res, error);
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  removePropertyImage
};
