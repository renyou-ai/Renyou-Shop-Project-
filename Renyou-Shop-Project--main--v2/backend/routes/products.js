import express from "express";
import Product from "../models/Product.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

const formatProduct = (product) => {
  const finalPrice =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;

  return {
    ...product.toObject(),
    finalPrice,
  };
};

// GET /api/products
router.get('/', auth, async (req, res) => {
  try {
const {
  category,
  brand,
  stockStatus,
  priceMin,
  priceMax,
  rating,
  search,
  sort,
  page = 1,
  limit = 9,
} = req.query;

const filter = {};

    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { supplier: { $regex: search, $options: 'i' } },
    ];
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (stockStatus) filter.stockStatus = stockStatus;

    const total = await Product.countDocuments(filter);
const products = await Product.find(filter)
  .populate("category", "name")
  .populate("brand", "name")
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(Number(limit));

    res.json({
  products: products.map(formatProduct),
  total,
  page: Number(page),
  pages: Math.ceil(total / limit)
});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/alerts
router.get('/alerts', auth, async (req, res) => {
  try {
    const alerts = await Product.find({ stockStatus: { $in: ['LOW_STOCK', 'OUT_OF_STOCK'] } })
      .populate('category', 'name icon')
      .sort({ stock: 1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [total, inStock, lowStock, outOfStock] = await Promise.all([
      Product.countDocuments({ status: 'ACTIVE' }),
      Product.countDocuments({ stockStatus: 'IN_STOCK' }),
      Product.countDocuments({ stockStatus: 'LOW_STOCK' }),
      Product.countDocuments({ stockStatus: 'OUT_OF_STOCK' }),
    ]);
    const totalValue = await Product.aggregate([{ $group: { _id: null, total: { $sum: { $multiply: ['$stock', '$cost'] } } } }]);
    const pending = await Product.countDocuments({ stockStatus: { $ne: 'IN_STOCK' } });

    res.json({
      total,
      inStock,
      lowStock,
      outOfStock,
      totalValue: totalValue[0]?.total || 0,
      pendingShipments: pending,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUBLIC PRODUCTS FOR SHOP
router.get('/public/list', async (req, res) => {
  try {

const {
  category,
  brand,
  stockStatus,
  priceMin,
  priceMax,
  rating,
  search,
  sort,
  page = 1,
  limit = 9,
} = req.query;

    const filter = {
      status: 'ACTIVE'
    };

    if (category) {
      filter.category = category;
    }

    if (brand) {
      filter.brand = brand;
    }

    if (stockStatus) {
      filter.stockStatus = stockStatus;
    }

    if (priceMin || priceMax) {
  filter.price = {};

  if (priceMin) {
    filter.price.$gte = Number(priceMin);
  }

  if (priceMax) {
    filter.price.$lte = Number(priceMax);
  }
}

if (rating !== undefined && rating !== null && rating !== '') {
  const ratingValue = Number(rating);

  if (!isNaN(ratingValue)) {
    filter.rating = {
      $gte: ratingValue,
    };
  }
}

if (search) {
  filter.$or = [
    {
      name: {
        $regex: search,
        $options: 'i'
      }
    }
  ];
}

let sortOption = { createdAt: -1 };

if (sort === 'price_asc') {
  sortOption = { price: 1 };
}

if (sort === 'price_desc') {
  sortOption = { price: -1 };
}

if (sort === 'newest') {
  sortOption = { createdAt: -1 };
}

const products = await Product.find(filter)
  .populate("category", "name")
  .populate("brand", "name")
  .sort(sortOption)
  .skip((page - 1) * limit)
  .limit(Number(limit));

  const total = await Product.countDocuments(filter);

  const maxPriceProduct = await Product.findOne(filter)
  .sort({ price: -1 })
  .select("price");

res.json({
  products: products.map(formatProduct),
  total,
  page: Number(page),
  pages: Math.ceil(total / limit),
  maxPrice: maxPriceProduct?.price ?? 0,
});

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// PUBLIC FEATURED PRODUCTS (Best Sellers)
router.get("/public/featured", async (req, res) => {
  try {
    const products = await Product.find({
      status: "ACTIVE",
      featured: true,
    })
      .populate("category", "name")
      .populate("brand", "name")
      .limit(4);

    res.json(products.map(formatProduct));
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// PUBLIC PRODUCT DETAILS FOR SHOP
router.get('/public/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('brand', 'name');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(formatProduct(product));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).populate('category brand');
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(formatProduct(p));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products
router.post('/', auth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    await product.populate('category brand');
    res.status(201).json(formatProduct(product));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product
router.put("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate("category brand");

    if (!product) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json(formatProduct(product));

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});

// Delete product
router.delete("/:id", auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/review', async (req, res) => {
  try {
    const { userName, rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    const review = {
      userName,
      rating: Number(rating),
      comment,
    };

product.reviews.push(review);

await product.save();

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Get all reviews for one product
router.get("/:id/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select(
      "reviews rating reviewCount"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      rating: product.rating,
      reviewCount: product.reviewCount,
      reviews: product.reviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;