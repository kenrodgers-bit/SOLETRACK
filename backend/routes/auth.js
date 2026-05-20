import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const makeToken = (user) => jwt.sign(
  { id: user._id, name: user.name, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    const pin = req.body.pin?.trim();

    if (pin) {
      if (!/^\d{6}$/.test(pin)) return res.status(400).json({ message: 'PIN must be 6 digits.' });
      const staffUsers = await User.find({ role: 'Staff' }).select('+pin');
      for (const user of staffUsers) {
        if (user.pin && await bcrypt.compare(pin, user.pin)) {
          return res.json({ token: makeToken(user), user: { id: user._id, name: user.name, role: user.role } });
        }
      }
      return res.status(401).json({ message: 'Invalid PIN.' });
    }

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email: email.toLowerCase(), role: 'Admin' }).select('+password');
    if (!user || !user.password) return res.status(401).json({ message: 'Invalid email or password.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password.' });

    res.json({ token: makeToken(user), user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error: error.message });
  }
});

export default router;
