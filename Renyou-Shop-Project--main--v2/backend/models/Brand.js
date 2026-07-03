import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  logo: { type: String, default: ''},
  country: { type: String },
  website: { type: String },
  productCount: { type: Number, default: 0 },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Brand', brandSchema);
