const express = require('express');
const multer = require('multer');
const { auth, optionalAuth, adminAuth, agentOrAdminAuth } = require('../middleware/auth');
const { maxSizeMb } = require('../services/imageStorage');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  removePropertyImage
} = require('../controllers/propertyController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSizeMb * 1024 * 1024, files: 10 },
  fileFilter: (req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
      return callback(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed'));
    }
    callback(null, true);
  }
});

router.get('/', optionalAuth, getProperties);
router.post('/images/upload', agentOrAdminAuth, (req, res, next) => {
  upload.array('images', 10)(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  });
}, uploadPropertyImages);
router.get('/:id', optionalAuth, getPropertyById);
router.post('/', auth, adminAuth, createProperty);
router.put('/:id', auth, agentOrAdminAuth, updateProperty);
router.delete('/:id', auth, adminAuth, deleteProperty);
router.delete('/:id/images', agentOrAdminAuth, removePropertyImage);

module.exports = router;
