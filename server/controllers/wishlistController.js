const Wishlist = require('../models/Wishlist');
const Property = require('../models/Property');
const { publicError } = require('../utils/publicError');

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('properties');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, properties: [] });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const property = await Property.findById(req.body.propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        properties: [req.body.propertyId]
      });
    } else {
      if (!wishlist.properties.includes(req.body.propertyId)) {
        wishlist.properties.push(req.body.propertyId);
        await wishlist.save();
      }
    }

    await wishlist.populate('properties');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.properties = wishlist.properties.filter(
      id => id.toString() !== req.params.propertyId
    );

    await wishlist.save();
    await wishlist.populate('properties');

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
