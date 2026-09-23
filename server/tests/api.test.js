const request = require('supertest');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-with-at-least-32-characters-long';
process.env.JWT_EXPIRES_IN = '1h';
process.env.CLIENT_URL = 'http://localhost:5173';

const app = require('../app');
const User = require('../models/User');
const Property = require('../models/Property');
const Unit = require('../models/Unit');
const Booking = require('../models/Booking');
const Enquiry = require('../models/Enquiry');
const Visit = require('../models/Visit');
const Wishlist = require('../models/Wishlist');

let mongo;
let admin;
let agentOne;
let agentTwo;
let userOne;
let userTwo;
let propertyOne;
let propertyTwo;
let unitOne;

const propertyData = (agent) => ({
  title: 'Test Residency',
  description: 'Test property',
  location: 'Test Location',
  city: 'Test City',
  state: 'Test State',
  price: 5000000,
  propertyType: 'APARTMENT',
  bhk: 2,
  area: 1000,
  bedrooms: 2,
  bathrooms: 2,
  status: 'AVAILABLE',
  agent
});

const tokenFor = async (email, password) => {
  const response = await request(app).post('/api/auth/login').send({ email, password });
  return response.body.token;
};

beforeAll(async () => {
  jest.setTimeout(30000);
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}), Property.deleteMany({}), Unit.deleteMany({}), Booking.deleteMany({}),
    Enquiry.deleteMany({}), Visit.deleteMany({}), Wishlist.deleteMany({})
  ]);

  [admin, agentOne, agentTwo, userOne, userTwo] = await User.create([
    { name: 'Admin', email: 'admin@test.com', phone: '1000000001', password: 'admin123', role: 'ADMIN' },
    { name: 'Agent One', email: 'agent1@test.com', phone: '1000000002', password: 'agent123', role: 'AGENT' },
    { name: 'Agent Two', email: 'agent2@test.com', phone: '1000000003', password: 'agent123', role: 'AGENT' },
    { name: 'User One', email: 'user1@test.com', phone: '1000000004', password: 'user123', role: 'USER' },
    { name: 'User Two', email: 'user2@test.com', phone: '1000000005', password: 'user123', role: 'USER' }
  ]);
  [propertyOne, propertyTwo] = await Property.create([propertyData(agentOne._id), { ...propertyData(agentTwo._id), title: 'Other Residency' }]);
  unitOne = await Unit.create({ property: propertyOne._id, unitNumber: 'A-101', block: 'A', bhk: 2, area: 1000, price: 5000000, status: 'AVAILABLE' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('authentication and authorization', () => {
  test('registers with a bcrypt password hash', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'New User', email: 'new@test.com', phone: '1000000006', password: 'new123', confirmPassword: 'new123'
    });
    expect(response.status).toBe(201);
    expect(response.body.user).not.toHaveProperty('password');
    const user = await User.findOne({ email: 'new@test.com' }).select('+password');
    expect(user.password).not.toBe('new123');
    expect(await bcrypt.compare('new123', user.password)).toBe(true);
  });

  test('logs in and authenticates a JWT', async () => {
    const token = await tokenFor('user1@test.com', 'user123');
    const response = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe('user1@test.com');
  });

  test('rejects non-admin access to admin statistics', async () => {
    const token = await tokenFor('user1@test.com', 'user123');
    const response = await request(app).get('/api/dashboard/stats').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(403);
  });
});

describe('property and unit CRUD authorization', () => {
  test('admin can create, update, and delete properties', async () => {
    const token = await tokenFor('admin@test.com', 'admin123');
    const created = await request(app).post('/api/properties').set('Authorization', `Bearer ${token}`).send(propertyData(agentOne._id));
    expect(created.status).toBe(201);
    const updated = await request(app).put(`/api/properties/${created.body._id}`).set('Authorization', `Bearer ${token}`).send({ title: 'Updated Residency' });
    expect(updated.body.title).toBe('Updated Residency');
    expect((await request(app).delete(`/api/properties/${created.body._id}`).set('Authorization', `Bearer ${token}`)).status).toBe(200);
  });

  test('agents only see and manage assigned properties and units', async () => {
    const token = await tokenFor('agent1@test.com', 'agent123');
    const properties = await request(app).get('/api/properties?limit=100').set('Authorization', `Bearer ${token}`);
    expect(properties.body.properties.map(property => property._id)).toContain(propertyOne._id.toString());
    expect(properties.body.properties.map(property => property._id)).not.toContain(propertyTwo._id.toString());
    expect((await request(app).put(`/api/properties/${propertyTwo._id}`).set('Authorization', `Bearer ${token}`).send({ title: 'Forbidden' })).status).toBe(403);
    expect((await request(app).post('/api/units').set('Authorization', `Bearer ${token}`).send({ property: propertyTwo._id, unitNumber: 'X-1', bhk: 1, area: 500, price: 1000000 })).status).toBe(403);
  });

  test('admin can create, update, and delete units', async () => {
    const token = await tokenFor('admin@test.com', 'admin123');
    const created = await request(app).post('/api/units').set('Authorization', `Bearer ${token}`).send({ property: propertyOne._id, unitNumber: 'B-201', bhk: 3, area: 1400, price: 7000000 });
    expect(created.status).toBe(201);
    expect((await request(app).put(`/api/units/${created.body._id}`).set('Authorization', `Bearer ${token}`).send({ status: 'RESERVED' })).body.status).toBe('RESERVED');
    expect((await request(app).delete(`/api/units/${created.body._id}`).set('Authorization', `Bearer ${token}`)).status).toBe(200);
  });
});

describe('wishlist, enquiries, and visits', () => {
  test('wishlist is isolated to the authenticated user', async () => {
    const token = await tokenFor('user1@test.com', 'user123');
    await request(app).post('/api/wishlist').set('Authorization', `Bearer ${token}`).send({ propertyId: propertyOne._id });
    const otherToken = await tokenFor('user2@test.com', 'user123');
    const otherWishlist = await request(app).get('/api/wishlist').set('Authorization', `Bearer ${otherToken}`);
    expect(otherWishlist.body.properties).toHaveLength(0);
  });

  test('users submit enquiries and assigned agents can update status only', async () => {
    const userToken = await tokenFor('user1@test.com', 'user123');
    const created = await request(app).post('/api/enquiries').set('Authorization', `Bearer ${userToken}`).send({ property: propertyOne._id, name: 'User One', email: 'user1@test.com', phone: '1000000004', message: 'Interested' });
    expect(created.status).toBe(201);
    const agentToken = await tokenFor('agent1@test.com', 'agent123');
    const updated = await request(app).put(`/api/enquiries/${created.body._id}`).set('Authorization', `Bearer ${agentToken}`).send({ status: 'INTERESTED' });
    expect(updated.body.status).toBe('INTERESTED');
    const otherAgentToken = await tokenFor('agent2@test.com', 'agent123');
    expect((await request(app).get('/api/enquiries').set('Authorization', `Bearer ${otherAgentToken}`)).body).toHaveLength(0);
  });

  test('users request visits and assigned agents can update them', async () => {
    const userToken = await tokenFor('user1@test.com', 'user123');
    const futureDate = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);
    const created = await request(app).post('/api/visits').set('Authorization', `Bearer ${userToken}`).send({ property: propertyOne._id, date: futureDate, time: '10:00', name: 'User One', phone: '1000000004', message: 'Visit' });
    expect(created.status).toBe(201);
    const agentToken = await tokenFor('agent1@test.com', 'agent123');
    expect((await request(app).put(`/api/visits/${created.body._id}`).set('Authorization', `Bearer ${agentToken}`).send({ status: 'CONFIRMED' })).body.status).toBe('CONFIRMED');
  });
});

describe('booking security', () => {
  test('enforces unit ownership, availability, trusted amount/payment, and user isolation', async () => {
    const userToken = await tokenFor('user1@test.com', 'user123');
    const otherUserToken = await tokenFor('user2@test.com', 'user123');
    const malicious = await request(app).post('/api/bookings').set('Authorization', `Bearer ${userToken}`).send({ property: propertyOne._id, unit: unitOne._id, bookingDate: new Date(Date.now() + 86400000).toISOString(), amount: 1, paymentStatus: 'PAID' });
    expect(malicious.status).toBe(400);
    const valid = await request(app).post('/api/bookings').set('Authorization', `Bearer ${userToken}`).send({ property: propertyOne._id, unit: unitOne._id, bookingDate: new Date(Date.now() + 86400000).toISOString() });
    expect(valid.status).toBe(201);
    expect(valid.body.amount).toBe(unitOne.price);
    expect(valid.body.paymentStatus).toBe('PENDING');
    expect((await request(app).post('/api/bookings').set('Authorization', `Bearer ${otherUserToken}`).send({ property: propertyOne._id, unit: unitOne._id, bookingDate: new Date(Date.now() + 86400000).toISOString() })).status).toBe(409);
    expect((await request(app).get('/api/bookings').set('Authorization', `Bearer ${otherUserToken}`)).body).toHaveLength(0);
  });

  test('rejects booking a unit belonging to another property', async () => {
    const otherUnit = await Unit.create({ property: propertyTwo._id, unitNumber: 'Z-1', bhk: 1, area: 500, price: 1000000 });
    const token = await tokenFor('user1@test.com', 'user123');
    const response = await request(app).post('/api/bookings').set('Authorization', `Bearer ${token}`).send({ property: propertyOne._id, unit: otherUnit._id, bookingDate: new Date(Date.now() + 86400000).toISOString() });
    expect(response.status).toBe(400);
  });
});
