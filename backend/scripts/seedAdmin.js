import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME || 'soletrack' });
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name: process.env.ADMIN_NAME || 'Admin', email, password: hashed, role: 'Admin' });
  console.log(`Admin created: ${email}`);
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
