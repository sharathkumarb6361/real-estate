const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', auth, adminAuth, getUsers);
router.get('/:id', auth, adminAuth, getUserById);
router.put('/:id', auth, adminAuth, updateUser);
router.delete('/:id', auth, adminAuth, deleteUser);

module.exports = router;
