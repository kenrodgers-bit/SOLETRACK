import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();
router.use(protect, adminOnly);

router.get('/', async (_req, res) => {
  const staff = await User.find({ role: 'Staff' }).sort({ createdAt: -1 });
  res.json(staff);
});

router.post('/', async (req, res) => {
  try {
    const { name, pin } = req.body;
    if (!name || !/^\d{6}$/.test(pin || '')) return res.status(400).json({ message: 'Name and 6-digit PIN are required.' });
    const hashedPin = await bcrypt.hash(pin, 10);
    const staff = await User.create({ name, pin: hashedPin, role: 'Staff' });
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: 'Could not create staff.', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, pin } = req.body;
    const payload = {};
    if (name) payload.name = name;
    if (pin) {
      if (!/^\d{6}$/.test(pin)) return res.status(400).json({ message: 'PIN must be 6 digits.' });
      payload.pin = await bcrypt.hash(pin, 10);
    }
    const staff = await User.findOneAndUpdate({ _id: req.params.id, role: 'Staff' }, payload, { new: true });
    if (!staff) return res.status(404).json({ message: 'Staff not found.' });
    res.json(staff);
  } catch (error) {
    res.status(400).json({ message: 'Could not update staff.', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const staff = await User.findOneAndDelete({ _id: req.params.id, role: 'Staff' });
  if (!staff) return res.status(404).json({ message: 'Staff not found.' });
  res.json({ message: 'Staff deleted.' });
});

export default router;
