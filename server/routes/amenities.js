const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const { getAmenities, createAmenity, updateAmenity, deleteAmenity } = require('../controllers/amenityController');

const router = express.Router();

router.get('/', getAmenities);
router.post('/', auth, adminAuth, createAmenity);
router.put('/:id', auth, adminAuth, updateAmenity);
router.delete('/:id', auth, adminAuth, deleteAmenity);

module.exports = router;
