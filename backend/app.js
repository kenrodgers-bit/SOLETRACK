import dns from 'dns';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import shoeRoutes from './routes/shoes.js';
import saleRoutes from './routes/sales.js';
import staffRoutes from './routes/staff.js';

dotenv.config();

const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const mongoDbName = process.env.MONGO_DB_NAME || 'soletrack';
let connectionPromise;

if (process.env.DNS_SERVERS) {
  const servers = process.env.DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean);
  if (servers.length) dns.setServers(servers);
}

const validateEnv = () => {
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);
  if (missingEnv.length) {
    throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  }

  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production.');
  }
};

export const connectDatabase = async () => {
  validateEnv();

  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI, { dbName: mongoDbName })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false
});

app.get('/api/health', async (_req, res, next) => {
  try {
    await connectDatabase();
    res.json({ ok: true, app: 'SoleTrack API', db: mongoose.connection.readyState === 1 ? 'connected' : 'connecting' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/shoes', shoeRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/staff', staffRoutes);

app.use((err, _req, res, _next) => {
  if (err.message === 'Not allowed by CORS') return res.status(403).json({ message: 'CORS blocked this origin.' });
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'Image must be 5MB or smaller.' });
  if (err.message === 'Only image uploads are allowed.') return res.status(400).json({ message: err.message });
  res.status(500).json({ message: err.message || 'Server error' });
});

export default app;
