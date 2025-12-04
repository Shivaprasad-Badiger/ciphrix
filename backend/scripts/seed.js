import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });

    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log('  Email: admin@example.com');
      console.log('  Role:', existingAdmin.role);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin123',
      role: 'admin',
    });

    console.log('Admin user created successfully:');
    console.log('  Name:', admin.name);
    console.log('  Email: admin@example.com');
    console.log('  Password: Admin123');
    console.log('  Role:', admin.role);
    console.log('\nPlease change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedAdmin();
