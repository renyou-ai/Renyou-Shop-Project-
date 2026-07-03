import express from 'express';
import { Coupon } from '../models/Coupon.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/public', async (req, res) => {
  try {
    const coupons = await Coupon.find({
      status: "ACTIVE",
    }).sort({ createdAt: -1 });

    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (search) filter.code = { $regex: search, $options: 'i' };
    if (status) filter.status = status;
    const coupons = await Coupon.find(filter).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const c = await Coupon.create(req.body);
    res.status(201).json(c);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const c = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(c);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
