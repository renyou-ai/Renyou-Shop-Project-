import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minPurchase: { type: Number, default: 0 },
  usageLimit: { type: Number },
  usageLimitPerCustomer: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'EXPIRED'], default: 'ACTIVE' },
  expiresAt: { type: Date },
  revenue: { type: Number, default: 0 },
  conversion: { type: String, default: '0%' },
}, { timestamps: true });

export const Coupon = mongoose.model('Coupon', couponSchema);