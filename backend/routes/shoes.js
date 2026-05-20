import express from 'express';
import multer from 'multer';
import Shoe from '../models/Shoe.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image uploads are allowed.'));
    return cb(null, true);
  }
});

const hasCloudinaryConfig = () => (
  process.env.CLOUDINARY_CLOUD_NAME
  && process.env.CLOUDINARY_API_KEY
  && process.env.CLOUDINARY_API_SECRET
);

const cleanSizes = (sizes = []) => sizes
  .filter(s => String(s.label || '').trim())
  .map(s => ({ label: String(s.label).trim(), quantity: Number(s.quantity || 0) }));

const uploadToCloudinary = (file) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream({
    folder: 'soletrack/shoes',
    resource_type: 'image',
    transformation: [{ width: 800, crop: 'limit', quality: 'auto' }]
  }, (error, result) => {
    if (error) return reject(error);
    return resolve(result);
  });

  stream.end(file.buffer);
});

router.get('/', protect, async (_req, res) => {
  const shoes = await Shoe.find().sort({ createdAt: -1 });
  res.json(shoes);
});

router.get('/:id', protect, async (req, res) => {
  const shoe = await Shoe.findById(req.params.id);
  if (!shoe) return res.status(404).json({ message: 'Shoe not found.' });
  res.json(shoe);
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const shoe = await Shoe.create({ ...req.body, sizes: cleanSizes(req.body.sizes) });
    res.status(201).json(shoe);
  } catch (error) {
    res.status(400).json({ message: 'Could not create shoe.', error: error.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (Array.isArray(payload.sizes)) payload.sizes = cleanSizes(payload.sizes);
    const shoe = await Shoe.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!shoe) return res.status(404).json({ message: 'Shoe not found.' });
    res.json(shoe);
  } catch (error) {
    res.status(400).json({ message: 'Could not update shoe.', error: error.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  const shoe = await Shoe.findByIdAndDelete(req.params.id);
  if (!shoe) return res.status(404).json({ message: 'Shoe not found.' });
  res.json({ message: 'Shoe deleted.' });
});

router.post('/:id/upload', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image file is required.' });
    if (!hasCloudinaryConfig()) return res.status(503).json({ message: 'Cloudinary is not configured on this server.' });

    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) return res.status(404).json({ message: 'Shoe not found.' });

    const result = await uploadToCloudinary(req.file);
    shoe.imageUrl = result.secure_url;
    await shoe.save();
    res.json({ imageUrl: shoe.imageUrl, shoe });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed.', error: error.message });
  }
});

export default router;
