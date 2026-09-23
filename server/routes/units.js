const express = require('express');
const { auth, optionalAuth, agentOrAdminAuth } = require('../middleware/auth');
const { getUnits, createUnit, updateUnit, deleteUnit } = require('../controllers/unitController');

const router = express.Router();

router.get('/', optionalAuth, getUnits);
router.post('/', auth, agentOrAdminAuth, createUnit);
router.put('/:id', auth, agentOrAdminAuth, updateUnit);
router.delete('/:id', auth, agentOrAdminAuth, deleteUnit);

module.exports = router;
