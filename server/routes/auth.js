const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login, getMe, requestPasswordReset, resetPassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { authRateLimit } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/register', authRateLimit, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, register);

router.post('/login', authRateLimit, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, login);

router.post('/forgot-password', authRateLimit, [
  body('email').isEmail().withMessage('Valid email is required')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, requestPasswordReset);

router.post('/reset-password', authRateLimit, [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, resetPassword);

router.get('/me', auth, getMe);

module.exports = router;
