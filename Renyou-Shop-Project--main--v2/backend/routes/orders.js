import express from 'express';
import Order from '../models/Order.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { orderId: { $regex: search, $options: 'i' } },
      { customerName: { $regex: search, $options: 'i' } },
      { customerEmail: { $regex: search, $options: 'i' } },
    ];
    if (status && status !== 'All Orders') filter.status = status.toUpperCase().replace(' ', '_');

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
  .populate('customer')
  .populate('items.product')
  .skip((page - 1) * limit)
  .limit(Number(limit))
  .sort({ date: -1 });

  const formattedOrders = orders.map(order => ({
  ...order.toObject(),
  customerAvatar:
    order.customerAvatar ||
    order.customer?.avatar ||
    order.customer?.profileImage ||
    null
}));

    res.json({
  orders: formattedOrders,
  total,
  page: Number(page),
  pages: Math.ceil(total / limit)
});;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const [total, pending, processing, revenue] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'PENDING' }),
      Order.countDocuments({ status: 'PROCESSING' }),
      Order.aggregate([
        { $match: { date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);
    res.json({ total, pending, processing, revenue30d: revenue[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer items.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {

    const order = await Order.create(req.body);

    res.status(201).json(order);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
