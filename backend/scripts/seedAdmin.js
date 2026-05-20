import dotenv from 'dotenv';
import dns from 'dns';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

if (process.env.DNS_SERVERS) {
  const servers = process.env.DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean);
  if (servers.length) dns.setServers(servers);
}

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME || 'soletrack' });
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const existing = await User.findOne({ email });
  const password = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'admin123');

  if (!password) {
    throw new Error('ADMIN_PASSWORD is required when NODE_ENV=production.');
  }

  if (process.env.NODE_ENV === 'production' && password.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters when NODE_ENV=production.');
  }

  const hashed = await bcrypt.hash(password, 10);

  if (existing && process.env.ADMIN_RESET !== 'true') {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  if (existing) {
    existing.name = process.env.ADMIN_NAME || existing.name || 'Admin';
    existing.password = hashed;
    existing.role = 'Admin';
    await existing.save();
    console.log(`Admin password reset: ${email}`);
    process.exit(0);
  }

  await User.create({ name: process.env.ADMIN_NAME || 'Admin', email, password: hashed, role: 'Admin' });
  console.log(`Admin created: ${email}`);
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
