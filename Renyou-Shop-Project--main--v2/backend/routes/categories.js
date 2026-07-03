import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC CATEGORIES
router.get('/public/list', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          category: cat._id,
          status: 'ACTIVE'
        });

        return {
          ...cat.toObject(),
          productCount: count
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
    const categories = await Category.find(filter).sort({ name: 1 });

    // Compute REAL productCount from DB for each category
    const enriched = await Promise.all(categories.map(async (cat) => {
      const count = await Product.countDocuments({ category: cat._id, status: 'ACTIVE' });
      return { ...cat.toObject(), productCount: count };
    }));

    res.json(enriched);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // Return with real productCount
    const count = await Product.countDocuments({ category: cat._id, status: 'ACTIVE' });
    res.json({ ...cat.toObject(), productCount: count });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
