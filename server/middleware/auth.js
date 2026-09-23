const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters');
  }
  return process.env.JWT_SECRET;
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return next();

    const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
    const user = await User.findById(decoded.id).select('-password');
    if (user?.isActive) req.user = user;
  } catch (error) {
    // Public property reads remain available when no valid session is present.
  }
  next();
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    res.status(403).json({ message: 'Admin access required' });
  }
};

const agentOrAdminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});

    if (req.user.role !== 'ADMIN' && req.user.role !== 'AGENT') {
      return res.status(403).json({ message: 'Agent or Admin access required' });
    }

    next();
  } catch (error) {
    res.status(403).json({ message: 'Agent or Admin access required' });
  }
};

module.exports = { auth, optionalAuth, adminAuth, agentOrAdminAuth };
