import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, sparse: true, unique: true },
  password: { type: String, select: false },
  pin: { type: String, select: false },
  role: { type: String, enum: ['Admin', 'Staff'], required: true, default: 'Staff' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.pin;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('User', userSchema);
