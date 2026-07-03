import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  sku: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  price: { type: Number, required: true },
  discountPercentage: {
  type: Number,
  default: 0,
},
  salePrice: { type: Number },
  cost: { type: Number },
  stock: { type: Number, default: 0 },
  maxStock: { type: Number, default: 100 },
  supplier: { type: String },
  image: { type: String, default: '' },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'DRAFT'], default: 'ACTIVE' },
  stockStatus: { type: String, enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'], default: 'IN_STOCK' },
  tags: [String],
  featured: { type: Boolean, default: false },

  routine: {
  period: {
    type: String,
    enum: ["morning", "evening"],
    default: null,
  },

  step: {
    type: Number,
    default: null,
  },

  label: {
    type: String,
    default: "",
  },
},

reviews: [
  {
    userName: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],

rating: {
  type: Number,
  default: 0,
},

reviewCount: {
  type: Number,
  default: 0,
},
}, { timestamps: true });

productSchema.pre("save", function (next) {
  // Stock status
  if (this.stock === 0) this.stockStatus = "OUT_OF_STOCK";
  else if (this.stock <= this.maxStock * 0.2) this.stockStatus = "LOW_STOCK";
  else this.stockStatus = "IN_STOCK";

  // Rating
  this.reviewCount = this.reviews.length;

  if (this.reviewCount > 0) {
    const total = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    this.rating = Number(
      (total / this.reviewCount).toFixed(1)
    );
  } else {
    this.rating = 0;
  }

  next();
});

export default mongoose.model('Product', productSchema);
