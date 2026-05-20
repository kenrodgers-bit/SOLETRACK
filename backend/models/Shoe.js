import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0, default: 0 }
}, { _id: false });

const shoeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  category: { type: String, default: 'Other', trim: true },
  sizes: { type: [sizeSchema], default: [] },
  buyingPrice: { type: Number, required: true, min: 0 },
  sellingPrice: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, default: '' },
  lowStockThreshold: { type: Number, default: 3, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Shoe', shoeSchema);
