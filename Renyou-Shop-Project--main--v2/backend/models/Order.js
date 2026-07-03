import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String },
  quantity: { type: Number, default: 1 },
  price: { type: Number },

  image: String,
  isBundle: Boolean,
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: { type: String },
  customerEmail: { type: String },
  customerAvatar: { type: String },
  items: [orderItemSchema],
  subtotal: { type: Number },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'RETURNED'],
    default: 'PENDING',
  },
  paymentMethod: { type: String, default: 'Card' },
  shippingAddress: { type: String },
  notes: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `#ORD-${String(count + 7700).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
