const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const { getBookings, createBooking, updateBooking, verifyBookingPayment } = require('../controllers/bookingController');

const router = express.Router();

router.get('/', auth, getBookings);
router.post('/', auth, createBooking);
router.put('/:id', auth, updateBooking);
router.post('/:id/payment-verified', auth, adminAuth, verifyBookingPayment);

module.exports = router;
