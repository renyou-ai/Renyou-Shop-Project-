import express from 'express';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const EN_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const EN_DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

router.get('/stats', auth, async (req, res) => {
  try {
    const [totalRevenue, totalOrders, activeProducts, totalCustomers] = await Promise.all([
      Order.aggregate([{ $match: { status: { $ne: 'CANCELLED' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments(),
      Product.countDocuments({ status: 'ACTIVE' }),
      Customer.countDocuments({ status: 'ACTIVE' }),
    ]);
    res.json({ revenue: totalRevenue[0]?.total || 0, orders: totalOrders, products: activeProducts, customers: totalCustomers });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/revenue-chart', auth, async (req, res) => {
  try {
    const { period = '7j' } = req.query;
    const data = [];
    const now = new Date();

    if (period === '7j') {
  for (let i = 6; i >= 0; i--) {

    const start = new Date();
    start.setDate(start.getDate() - i);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const rev = await Order.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
          status: { $ne: 'CANCELLED' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    data.push({
      day: `${String(start.getDate()).padStart(2,'0')}/${String(start.getMonth()+1).padStart(2,'0')}`,
      revenue: Math.round(rev[0]?.total || 0)
    });
  }

    } else if (period === '30j') {
      for (let i = 29; i >= 0; i--) {
        const start = new Date(); start.setDate(start.getDate() - i); start.setHours(0,0,0,0);
        const end = new Date(start); end.setHours(23,59,59,999);
        const rev = await Order.aggregate([{ $match: { date: { $gte: start, $lte: end }, status: { $ne: 'CANCELLED' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]);
        data.push({ day: `${start.getDate()}/${start.getMonth()+1}`, revenue: Math.round(rev[0]?.total || 0) });
      }
    } else if (period === '90j') {
      for (let i = 11; i >= 0; i--) {
        const start = new Date(); start.setDate(start.getDate() - i * 7); start.setHours(0,0,0,0);
        const end = new Date(start); end.setDate(end.getDate() + 6); end.setHours(23,59,59,999);
        const rev = await Order.aggregate([{ $match: { date: { $gte: start, $lte: end }, status: { $ne: 'CANCELLED' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]);
        data.push({ day: `W${12-i}`, revenue: Math.round(rev[0]?.total || 0) });
      }
    } else if (period === '6m') {

      const months6 = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
        const rev = await Order.aggregate([{ $match: { date: { $gte: d, $lte: end }, status: { $ne: 'CANCELLED' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]);
        months6.push({ monthIndex: d.getMonth(), label: EN_MONTHS[d.getMonth()], revenue: Math.round(rev[0]?.total || 0) });
      }
      // Sort by calendar month index
      months6.sort((a, b) => a.monthIndex - b.monthIndex);
      months6.forEach(m => data.push({ day: m.label, revenue: m.revenue }));

    } else if (period === '1an') {

  for (let i = 11; i >= 0; i--) {

    const start = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const end = new Date(
      start.getFullYear(),
      start.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const rev = await Order.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
          status: { $ne: 'CANCELLED' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    data.push({
      day: `${String(start.getMonth() + 1).padStart(2,'0')}/${String(start.getFullYear()).slice(-2)}`,
      revenue: Math.round(rev[0]?.total || 0)
    });
  }
}

    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/category-sales', auth, async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    const catMap = {};
    products.forEach(p => {
      const name = p.category?.name || 'Other';
      catMap[name] = (catMap[name] || 0) + p.stock * p.price;
    });
    const total = Object.values(catMap).reduce((a, b) => a + b, 0);
    const data = Object.entries(catMap).map(([name, value]) => ({ name, value: Math.round((value / total) * 100) || 0 }));
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/monthly-trend', auth, async (req, res) => {
  try {
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const [rev, custs] = await Promise.all([
        Order.aggregate([{ $match: { date: { $gte: d, $lte: end }, status: { $ne: 'CANCELLED' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
        Customer.countDocuments({ createdAt: { $gte: d, $lte: end } }),
      ]);
      data.push({ month: EN_MONTHS[d.getMonth()], revenue: Math.round(rev[0]?.total || 0), customers: custs });
    }
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/recent-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 }).limit(5);
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/stock-alerts', auth, async (req, res) => {
  try {
    const alerts = await Product.find({ stockStatus: { $in: ['LOW_STOCK', 'OUT_OF_STOCK'] } })
      .populate('category', 'name icon').sort({ stock: 1 }).limit(8);
    res.json(alerts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/top-products', auth, async (req, res) => {
  try {
    const products = await Product.find({ status: 'ACTIVE' }).populate('category', 'name icon').sort({ price: -1 }).limit(5);
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/top-customers', auth, async (req, res) => {
  try {
    const customers = await Customer.find({ status: 'ACTIVE' }).sort({ spent: -1 }).limit(5);
    res.json(customers);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
