import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Department from './models/Department.js';

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civicfix');

  await Department.deleteMany({});
  await User.deleteMany({});

  const departments = await Department.create([
    { name: 'Public Works', code: 'PW', description: 'Roads, drains, sanitation' },
    { name: 'Water Supply', code: 'WS', description: 'Water and utility issues' },
    { name: 'Health & Safety', code: 'HS', description: 'Public safety complaints' }
  ]);

  const password = await bcrypt.hash('123456', 10);
  await User.create({
    fullName: 'System Admin',
    email: 'admin@gmail.com',
    password,
    role: 'admin'
  });

  console.log('Seeded departments and admin user');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
