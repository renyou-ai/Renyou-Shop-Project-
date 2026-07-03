import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String, default: '📦' },
  color: { type: String, default: '#524E8D' },
  productCount: { type: Number, default: 0 },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
