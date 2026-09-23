const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed'));
  },
  credentials: true
}));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'EstateHub API Server is running' });
});

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const unitRoutes = require('./routes/units');
const enquiryRoutes = require('./routes/enquiries');
const visitRoutes = require('./routes/visits');
const bookingRoutes = require('./routes/bookings');
const wishlistRoutes = require('./routes/wishlist');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const notificationRoutes = require('./routes/notifications');
const amenityRoutes = require('./routes/amenities');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/amenities', amenityRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'development' ? (err.message || 'Internal Server Error') : 'Internal Server Error'
  });
});

module.exports = app;
