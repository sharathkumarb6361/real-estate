const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const { getStats, getAnalytics } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/stats', auth, adminAuth, getStats);
router.get('/analytics', auth, adminAuth, getAnalytics);

module.exports = router;
