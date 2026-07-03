// PATH: backend/models/Cart.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    // Snapshot at time of adding (in case price changes)
    priceAtAdd: {
      type: Number,
      required: true,
    },
    salePriceAtAdd: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    // Coupon applied to this cart
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    couponCode: {
      type: String,
      default: null,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtuals ──────────────────────────────────────────────────────
cartSchema.virtual("subtotal").get(function () {
  return this.items.reduce((sum, item) => {
    const price = item.salePriceAtAdd ?? item.priceAtAdd;
    return sum + price * item.quantity;
  }, 0);
});

cartSchema.virtual("total").get(function () {
  const sub = this.subtotal;
  return Math.max(0, sub - (this.couponDiscount || 0));
});

cartSchema.virtual("itemCount").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
