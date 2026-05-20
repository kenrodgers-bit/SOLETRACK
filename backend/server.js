import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dns from 'dns';
import authRoutes from './routes/auth.js';
import shoeRoutes from './routes/shoes.js';
import saleRoutes from './routes/sales.js';
import staffRoutes from './routes/staff.js';

dotenv.config();

const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

if (process.env.DNS_SERVERS) {
  const servers = process.env.DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean);
  if (servers.length) dns.setServers(servers);
}

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: (origin, cb) => (!origin || origin === allowedOrigin || allowedOrigin === '*') ? cb(null, true) : cb(new Error('Not allowed by CORS')) }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, app: 'SoleTrack API' }));
app.use('/api/auth', authRoutes);
app.use('/api/shoes', shoeRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/staff', staffRoutes);

app.use((err, _req, res, _next) => {
  if (err.message === 'Not allowed by CORS') return res.status(403).json({ message: 'CORS blocked this origin.' });
  res.status(500).json({ message: err.message || 'Server error' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`SoleTrack API running on port ${PORT}`)))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
