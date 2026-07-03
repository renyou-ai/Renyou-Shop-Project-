
import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Discount Code', 'BOGO', 'Banner', 'Flash Sale'], required: true },
  discountType: {
  type: String,
  enum: ["percentage", "fixed", "free_shipping"]
},

value: {
  type: Number,
  default: 0
},
  description: { type: String },
  targetCategory: { type: String, default: 'All Categories' },
  status: { type: String, enum: ['ACTIVE', 'SCHEDULED', 'ENDED', 'DRAFT'], default: 'DRAFT' },
  startDate: { type: Date },
  endDate: { type: Date },
  revenue: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  flashSale: { type: Boolean, default: false },

  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],

  image: { type: String },
}, { timestamps: true });

export const Promotion = mongoose.model('Promotion', promotionSchema);
