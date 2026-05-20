import express from 'express';
import Shoe from '../models/Shoe.js';
import Sale from '../models/Sale.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const { from, to } = req.query;
  const filter = {};
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }
  const sales = await Sale.find(filter).sort({ date: -1 }).limit(300);
  res.json(sales);
});

router.get('/today', protect, async (_req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const sales = await Sale.find({ date: { $gte: start, $lte: end } }).sort({ date: -1 });
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  res.json({ sales, totalRevenue });
});

router.post('/', protect, async (req, res) => {
  try {
    const { shoeId, size, qtySold } = req.body;
    const qty = Number(qtySold);
    if (!shoeId || !size || !qty || qty < 1) return res.status(400).json({ message: 'Shoe, size and valid quantity are required.' });

    const shoe = await Shoe.findById(shoeId);
    if (!shoe) return res.status(404).json({ message: 'Shoe not found.' });
    const targetSize = shoe.sizes.find(s => s.label === size);
    if (!targetSize) return res.status(400).json({ message: 'Selected size does not exist.' });
    if (targetSize.quantity < qty) return res.status(400).json({ message: `Only ${targetSize.quantity} pairs available for size ${size}.` });

    targetSize.quantity -= qty;
    await shoe.save();

    const sale = await Sale.create({
      shoe: shoe._id,
      shoeName: shoe.name,
      size,
      qtySold: qty,
      unitPrice: shoe.sellingPrice,
      totalAmount: qty * shoe.sellingPrice,
      soldBy: req.user.id,
      soldByName: req.user.name
    });

    res.status(201).json({ sale, shoe });
  } catch (error) {
    res.status(400).json({ message: 'Could not record sale.', error: error.message });
  }
});

export default router;
