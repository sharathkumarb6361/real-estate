const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../services/emailService');
const { publicError } = require('../utils/publicError');

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters');
  }
  return process.env.JWT_SECRET;
};

const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

const register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

const requestPasswordReset = async (req, res) => {
  const genericResponse = { message: 'If an account exists for that email, a password reset link has been sent.' };
  try {
    const email = req.body.email?.trim().toLowerCase();
    const user = await User.findOne({ email }).select('+passwordResetTokenHash +passwordResetExpires');

    if (!user || !user.isActive) return res.json(genericResponse);

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + Number(process.env.PASSWORD_RESET_TTL_MINUTES || 15) * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`;
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (emailError) {
      user.passwordResetTokenHash = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      console.error('Password reset email failed:', emailError.message);
    }

    return res.json(genericResponse);
  } catch (error) {
    console.error('Password reset request failed:', error.message);
    return res.json(genericResponse);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || password.length < 6) {
      return res.status(400).json({ message: 'A valid token and password of at least 6 characters are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: { $gt: new Date() }
    }).select('+password +passwordResetTokenHash +passwordResetExpires');

    if (!user) return res.status(400).json({ message: 'Reset token is invalid or expired' });

    user.password = password;
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: publicError(error) });
  }
};

module.exports = { register, login, getMe, requestPasswordReset, resetPassword };
