const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const Unit = require('../models/Unit');
const Amenity = require('../models/Amenity');
const Enquiry = require('../models/Enquiry');
const Visit = require('../models/Visit');
const Booking = require('../models/Booking');
const Wishlist = require('../models/Wishlist');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/estatehub';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Property.deleteMany({});
    await Unit.deleteMany({});
    await Amenity.deleteMany({});
    await Enquiry.deleteMany({});
    await Visit.deleteMany({});
    await Booking.deleteMany({});
    await Wishlist.deleteMany({});

    console.log('Cleared existing data');

    const amenities = await Amenity.create([
      { name: 'Swimming Pool', icon: 'pool', description: 'Beautiful swimming pool' },
      { name: 'Gym', icon: 'dumbbell', description: 'Modern fitness center' },
      { name: 'Clubhouse', icon: 'home', description: 'Community clubhouse' },
      { name: 'Garden', icon: 'flower', description: 'Landscaped gardens' },
      { name: 'Children\'s Play Area', icon: 'smile', description: 'Kids play area' },
      { name: 'Covered Parking', icon: 'car', description: 'Secure parking' },
      { name: 'Security', icon: 'shield', description: '24/7 security' },
      { name: 'CCTV', icon: 'camera', description: 'CCTV surveillance' },
      { name: 'Power Backup', icon: 'zap', description: 'Generator backup' },
      { name: 'Elevator', icon: 'arrow-up', description: 'Modern elevators' },
      { name: 'Jogging Track', icon: 'footprints', description: 'Jogging track' },
      { name: 'Community Hall', icon: 'users', description: 'Event space' }
    ]);

    console.log('Created amenities');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const agentPassword = await bcrypt.hash('agent123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@estatehub.com',
      phone: '9876543210',
      password: adminPassword,
      role: 'ADMIN'
    });

    const agent1 = await User.create({
      name: 'Rajesh Kumar',
      email: 'agent1@estatehub.com',
      phone: '9876543211',
      password: agentPassword,
      role: 'AGENT'
    });

    const agent2 = await User.create({
      name: 'Priya Sharma',
      email: 'agent2@estatehub.com',
      phone: '9876543212',
      password: agentPassword,
      role: 'AGENT'
    });

    const user1 = await User.create({
      name: 'Amit Patel',
      email: 'user1@estatehub.com',
      phone: '9876543213',
      password: userPassword,
      role: 'USER'
    });

    const user2 = await User.create({
      name: 'Sneha Reddy',
      email: 'user2@estatehub.com',
      phone: '9876543214',
      password: userPassword,
      role: 'USER'
    });

    console.log('Created users');

    const greenValley = await Property.create({
      title: 'Green Valley Residency',
      description: 'Premium residential apartments in the heart of Mangalore with world-class amenities and modern architecture.',
      location: 'Kulshekar, Mangalore',
      city: 'Mangalore',
      state: 'Karnataka',
      price: 6500000,
      propertyType: 'APARTMENT',
      bhk: 2,
      area: 1100,
      bedrooms: 2,
      bathrooms: 2,
      floor: 1,
      totalFloors: 5,
      parking: 1,
      amenities: amenities.slice(0, 8).map(a => a._id),
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
      ],
      floorPlan: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=800',
      possessionDate: new Date('2025-06-01'),
      constructionYear: 2023,
      status: 'AVAILABLE',
      agent: agent1._id,
      nearbyFacilities: {
        school: 'St. Aloysius School (1 km)',
        hospital: 'KMC Hospital (2 km)',
        shopping: 'City Centre Mall (1.5 km)',
        transportation: 'Bus Stand (1 km)'
      },
      isProject: true
    });

    const property2 = await Property.create({
      title: 'Sunrise Villas',
      description: 'Luxurious independent villas with private gardens and premium finishes.',
      location: 'Kadri, Mangalore',
      city: 'Mangalore',
      state: 'Karnataka',
      price: 15000000,
      propertyType: 'VILLA',
      bhk: 4,
      area: 3500,
      bedrooms: 4,
      bathrooms: 4,
      floor: 1,
      totalFloors: 2,
      parking: 2,
      amenities: amenities.slice(0, 10).map(a => a._id),
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
      ],
      floorPlan: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=800',
      possessionDate: new Date('2024-12-01'),
      constructionYear: 2022,
      status: 'AVAILABLE',
      agent: agent2._id,
      nearbyFacilities: {
        school: 'NITK School (2 km)',
        hospital: 'Asha Kirana Hospital (1 km)',
        shopping: 'Forum Mall (3 km)',
        transportation: 'Railway Station (2 km)'
      },
      isProject: false
    });

    const property3 = await Property.create({
      title: 'Marina Heights',
      description: 'Sea-facing apartments with stunning views of the Arabian Sea.',
      location: 'Panambur, Mangalore',
      city: 'Mangalore',
      state: 'Karnataka',
      price: 8500000,
      propertyType: 'APARTMENT',
      bhk: 3,
      area: 1800,
      bedrooms: 3,
      bathrooms: 3,
      floor: 5,
      totalFloors: 15,
      parking: 2,
      amenities: amenities.map(a => a._id),
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800'
      ],
      floorPlan: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=800',
      possessionDate: new Date('2025-03-01'),
      constructionYear: 2023,
      status: 'AVAILABLE',
      agent: agent1._id,
      nearbyFacilities: {
        school: 'Canara School (1.5 km)',
        hospital: 'Apollo Hospital (3 km)',
        shopping: 'PVS Mall (2 km)',
        transportation: 'Airport (5 km)'
      },
      isProject: false
    });

    const property4 = await Property.create({
      title: 'Business Hub',
      description: 'Premium commercial office spaces in the central business district.',
      location: 'Hampankatta, Mangalore',
      city: 'Mangalore',
      state: 'Karnataka',
      price: 25000000,
      propertyType: 'COMMERCIAL',
      bhk: 0,
      area: 5000,
      bedrooms: 0,
      bathrooms: 4,
      floor: 3,
      totalFloors: 10,
      parking: 10,
      amenities: [amenities[5]._id, amenities[6]._id, amenities[7]._id, amenities[8]._id],
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
      ],
      possessionDate: new Date('2024-10-01'),
      constructionYear: 2022,
      status: 'AVAILABLE',
      agent: agent2._id,
      nearbyFacilities: {
        school: 'N/A',
        hospital: 'Hospital District (0.5 km)',
        shopping: 'Central Market (0.2 km)',
        transportation: 'Bus Stand (0.5 km)'
      },
      isProject: false
    });

    const property5 = await Property.create({
      title: 'Garden City Plots',
      description: 'Residential plots in a gated community with all infrastructure.',
      location: 'Kankanady, Mangalore',
      city: 'Mangalore',
      state: 'Karnataka',
      price: 4500000,
      propertyType: 'PLOT',
      bhk: 0,
      area: 2400,
      bedrooms: 0,
      bathrooms: 0,
      floor: 0,
      totalFloors: 0,
      parking: 0,
      amenities: [amenities[3]._id, amenities[5]._id, amenities[6]._id],
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
      ],
      possessionDate: new Date('2024-08-01'),
      constructionYear: 0,
      status: 'AVAILABLE',
      agent: agent1._id,
      nearbyFacilities: {
        school: 'Vijaya School (1 km)',
        hospital: 'Hospital (2 km)',
        shopping: 'Local Market (1 km)',
        transportation: 'Bus Stop (0.5 km)'
      },
      isProject: false
    });

    const property6 = await Property.create({
      title: 'Heritage House',
      description: 'Beautiful traditional house with modern renovations in a prime location.',
      location: 'Balmatta, Mangalore',
      city: 'Mangalore',
      state: 'Karnataka',
      price: 12000000,
      propertyType: 'HOUSE',
      bhk: 3,
      area: 2500,
      bedrooms: 3,
      bathrooms: 2,
      floor: 1,
      totalFloors: 2,
      parking: 1,
      amenities: amenities.slice(0, 6).map(a => a._id),
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'
      ],
      possessionDate: new Date('2024-11-01'),
      constructionYear: 2015,
      status: 'SOLD',
      agent: agent2._id,
      nearbyFacilities: {
        school: 'St. Mary\'s School (0.5 km)',
        hospital: 'Hospital (1 km)',
        shopping: 'Market (0.5 km)',
        transportation: 'Bus Stand (1 km)'
      },
      isProject: false
    });

    console.log('Created properties');

    const units = await Unit.create([
      { property: greenValley._id, unitNumber: 'A-101', block: 'A', floor: 1, bhk: 2, area: 1100, price: 6500000, status: 'AVAILABLE', bedrooms: 2, bathrooms: 2, parking: 1 },
      { property: greenValley._id, unitNumber: 'A-102', block: 'A', floor: 1, bhk: 2, area: 1150, price: 6800000, status: 'BOOKED', bedrooms: 2, bathrooms: 2, parking: 1 },
      { property: greenValley._id, unitNumber: 'A-103', block: 'A', floor: 1, bhk: 2, area: 1120, price: 6600000, status: 'AVAILABLE', bedrooms: 2, bathrooms: 2, parking: 1 },
      { property: greenValley._id, unitNumber: 'B-201', block: 'B', floor: 2, bhk: 3, area: 1500, price: 9000000, status: 'AVAILABLE', bedrooms: 3, bathrooms: 2, parking: 1 },
      { property: greenValley._id, unitNumber: 'B-202', block: 'B', floor: 2, bhk: 3, area: 1550, price: 9400000, status: 'AVAILABLE', bedrooms: 3, bathrooms: 2, parking: 1 },
      { property: greenValley._id, unitNumber: 'B-203', block: 'B', floor: 2, bhk: 3, area: 1520, price: 9200000, status: 'SOLD', bedrooms: 3, bathrooms: 2, parking: 1 },
      { property: greenValley._id, unitNumber: 'C-301', block: 'C', floor: 3, bhk: 2, area: 1200, price: 7200000, status: 'AVAILABLE', bedrooms: 2, bathrooms: 2, parking: 1 },
      { property: greenValley._id, unitNumber: 'C-302', block: 'C', floor: 3, bhk: 2, area: 1250, price: 7500000, status: 'RESERVED', bedrooms: 2, bathrooms: 2, parking: 1 },
      { property: greenValley._id, unitNumber: 'D-401', block: 'D', floor: 4, bhk: 3, area: 1600, price: 9800000, status: 'AVAILABLE', bedrooms: 3, bathrooms: 3, parking: 2 },
      { property: greenValley._id, unitNumber: 'D-402', block: 'D', floor: 4, bhk: 3, area: 1650, price: 10200000, status: 'AVAILABLE', bedrooms: 3, bathrooms: 3, parking: 2 }
    ]);

    console.log('Created units');

    const enquiry1 = await Enquiry.create({
      user: user1._id,
      property: greenValley._id,
      name: 'Amit Patel',
      email: 'user1@estatehub.com',
      phone: '9876543213',
      message: 'I am interested in this property. Please provide more details.',
      status: 'NEW',
      agent: agent1._id
    });

    const enquiry2 = await Enquiry.create({
      user: user2._id,
      property: property2._id,
      name: 'Sneha Reddy',
      email: 'user2@estatehub.com',
      phone: '9876543214',
      message: 'Would like to schedule a visit this weekend.',
      status: 'CONTACTED',
      agent: agent2._id
    });

    console.log('Created enquiries');

    const visit1 = await Visit.create({
      user: user1._id,
      property: greenValley._id,
      date: new Date('2024-10-15'),
      time: '10:00 AM',
      name: 'Amit Patel',
      phone: '9876543213',
      message: 'I would like to see the 2BHK units',
      status: 'CONFIRMED',
      agent: agent1._id
    });

    const visit2 = await Visit.create({
      user: user2._id,
      property: property3._id,
      date: new Date('2024-10-20'),
      time: '2:00 PM',
      name: 'Sneha Reddy',
      phone: '9876543214',
      message: 'Interested in sea-facing apartment',
      status: 'PENDING',
      agent: agent1._id
    });

    console.log('Created visits');

    const booking1 = await Booking.create({
      user: user1._id,
      property: greenValley._id,
      unit: units[1]._id,
      bookingDate: new Date('2024-09-01'),
      amount: 6800000,
      status: 'APPROVED',
      notes: 'Initial payment done',
      paymentStatus: 'PAID'
    });

    const booking2 = await Booking.create({
      user: user2._id,
      property: property3._id,
      bookingDate: new Date('2024-09-20'),
      amount: 8500000,
      status: 'PENDING',
      notes: 'Awaiting approval',
      paymentStatus: 'PENDING'
    });

    console.log('Created bookings');

    await Wishlist.create({
      user: user1._id,
      properties: [greenValley._id, property3._id]
    });

    await Wishlist.create({
      user: user2._id,
      properties: [property2._id, property4._id, property5._id]
    });

    console.log('Created wishlists');

    await agent1.updateOne({ assignedProperties: [greenValley._id, property3._id] });
    await agent2.updateOne({ assignedProperties: [property2._id, property4._id, property6._id] });

    console.log('Assigned properties to agents');

    console.log('\n=== Seed Data Created Successfully ===\n');
    console.log('Demo Accounts:');
    console.log('Admin: admin@estatehub.com / admin123');
    console.log('Agent 1: agent1@estatehub.com / agent123');
    console.log('Agent 2: agent2@estatehub.com / agent123');
    console.log('User 1: user1@estatehub.com / user123');
    console.log('User 2: user2@estatehub.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
