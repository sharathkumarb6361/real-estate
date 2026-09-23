const express = require('express');
const { auth, adminAuth, agentOrAdminAuth } = require('../middleware/auth');
const {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry
} = require('../controllers/enquiryController');

const router = express.Router();

router.get('/', auth, getEnquiries);
router.get('/:id', auth, getEnquiryById);
router.post('/', auth, createEnquiry);
router.put('/:id', auth, agentOrAdminAuth, updateEnquiry);
router.delete('/:id', auth, adminAuth, deleteEnquiry);

module.exports = router;
