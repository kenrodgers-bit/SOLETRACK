import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  shoe: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoe', required: true },
  shoeName: { type: String, required: true },
  size: { type: String, required: true },
  qtySold: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  soldByName: { type: String, default: 'Unknown' },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Sale', saleSchema);
