import app, { connectDatabase } from './app.js';

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`SoleTrack API running on port ${PORT}`)))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
