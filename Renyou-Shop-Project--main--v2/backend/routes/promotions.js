import express from 'express';
import { Promotion } from '../models/Promotion.js';
import Brand from '../models/Brand.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/flash-sale', async (req, res) => {
  try {
    const promo = await Promotion.findOne({
      flashSale: true,
      status: 'ACTIVE'
    }).populate({
  path: "products",
  populate: {
    path: "brand",
    select: "name"
  }
});

    if (!promo) {
      return res.status(404).json({
        message: 'No active flash sale found'
      });
    }

    res.json(promo.products);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (status) filter.status = status;
    const promotions = await Promotion.find(filter).sort({ createdAt: -1 });
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const p = await Promotion.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const p = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
