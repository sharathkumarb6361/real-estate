const express = require('express');
const { auth, agentOrAdminAuth } = require('../middleware/auth');
const { getVisits, createVisit, updateVisit } = require('../controllers/visitController');

const router = express.Router();

router.get('/', auth, getVisits);
router.post('/', auth, createVisit);
router.put('/:id', auth, updateVisit);

module.exports = router;
