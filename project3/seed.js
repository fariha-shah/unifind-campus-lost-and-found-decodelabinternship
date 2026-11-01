// ============================================
// UniFind — Database Seed Script
// Populates realistic mock data for demonstration
// ============================================

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Item = require('./models/Item');
const Claim = require('./models/Claim');
const Message = require('./models/Message');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/unifind';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(uri);
    console.log('Connected! Clearing existing data...');

    await Promise.all([
      User.deleteMany({}),
      Item.deleteMany({}),
      Claim.deleteMany({}),
      Message.deleteMany({}),
    ]);

    console.log('Seeding demo users...');
    const salt = await bcrypt.genSalt(10);
    const demoPassword = await bcrypt.hash('password123', salt);

    const userAhmed = await User.create({
      name: 'Ahmed Khan',
      email: 'ahmed@university.edu',
      password: demoPassword,
      studentId: '2024-CS-0042',
      department: 'Computer Science',
    });

    const userSara = await User.create({
      name: 'Sara Malik',
      email: 'sara@university.edu',
      password: demoPassword,
      studentId: '2023-EE-0118',
      department: 'Electrical Engineering',
    });

    const userBilal = await User.create({
      name: 'Bilal Tariq',
      email: 'bilal@university.edu',
      password: demoPassword,
      studentId: '2024-BBA-0089',
      department: 'Business Administration',
    });

    console.log('Seeding items...');
    const items = await Item.insertMany([
      {
        title: 'iPhone 14 Pro – Space Black',
        category: 'electronics',
        status: 'lost',
        location: 'Science Block',
        description:
          'Lost near physics lab corridor around 2:00 PM. Has a matte black case with a minor scratch on screen protector.',
        poster: userAhmed.email,
        image: null,
      },
      {
        title: 'Silver Key Bundle (3 Keys with Blue Lanyard)',
        category: 'keys',
        status: 'found',
        location: 'Cafeteria',
        description:
          'Found on the corner wooden table near the cafeteria entrance. Has 3 silver keys and a blue university lanyard.',
        poster: userSara.email,
        image: null,
      },
      {
        title: 'Navy Blue Backpack (Jansport)',
        category: 'bags',
        status: 'lost',
        location: 'Main Library',
        description:
          'Left on 2nd floor silent study desk. Contains lecture notebooks for Data Structures and a metallic water bottle.',
        poster: userAhmed.email,
        image: null,
      },
      {
        title: 'Apple AirPods Pro in White Case',
        category: 'electronics',
        status: 'found',
        location: 'CS Department',
        description:
          'Found plugged into charging dock in Computer Lab 3. Has a small red silicone protective cover.',
        poster: userBilal.email,
        image: null,
      },
      {
        title: 'Student ID Card & Green Wallet',
        category: 'documents',
        status: 'found',
        location: 'Student Center',
        description:
          'Found near ATM machine. Student ID belongs to Department of Mechanical Engineering. Safe with security desk.',
        poster: userSara.email,
        image: null,
      },
      {
        title: 'TI-84 Plus CE Graphing Calculator',
        category: 'electronics',
        status: 'returned',
        location: 'Lecture Hall B',
        description:
          'Accidentally left after Calculus II midterm exam. Successfully returned to owner.',
        poster: userAhmed.email,
        image: null,
      },
    ]);

    console.log('Seeding sample claims & chat messages...');
    const keyItem = items[1];
    const phoneItem = items[0];

    await Claim.create({
      itemId: keyItem._id.toString(),
      itemTitle: keyItem.title,
      claimerName: 'Hamza Farooq',
      claimerEmail: 'hamza@university.edu',
      message:
        'Hi Sara! I think these are my hostel room keys. One of them has a small notch near the base. Can we meet up?',
      status: 'pending',
    });

    await Message.create({
      itemId: phoneItem._id.toString(),
      sender: 'Sara Malik',
      text: 'Salam Ahmed, I saw a black iPhone at the Science Block reception desk earlier!',
      type: 'received',
    });

    await Message.create({
      itemId: phoneItem._id.toString(),
      sender: 'Ahmed Khan',
      text: 'Thank you so much Sara! I will go check with reception right now.',
      type: 'sent',
    });

    console.log('Database successfully seeded!');
    console.log('-------------------------------------------');
    console.log('Demo Credentials:');
    console.log('Email:    ahmed@university.edu');
    console.log('Password: password123');
    console.log('-------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
