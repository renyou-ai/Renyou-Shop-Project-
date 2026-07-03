import express from 'express';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

function computeAvatar(name) {
  const parts = (name||'').trim().split(/\s+/).filter(Boolean);
  if (parts.length>=2) return (parts[0][0]+parts[parts.length-1][0]).toUpperCase();
  return (name||'?').slice(0,2).toUpperCase();
}

router.get('/', auth, async (req,res) => {
  try {
    const { search, status, loyalty, page=1, limit=12 } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { name:{$regex:search,$options:'i'} },
      { email:{$regex:search,$options:'i'} },
      { customerId:{$regex:search,$options:'i'} },
      { city:{$regex:search,$options:'i'} },
    ];
    if (status) filter.status = status;
    if (loyalty) filter.loyalty = loyalty;
    const total = await Customer.countDocuments(filter);
    const customers = await Customer.find(filter).skip((page-1)*limit).limit(Number(limit)).sort({createdAt:-1});
    res.json({ customers, total, page:Number(page), pages:Math.ceil(total/limit) });
  } catch(err) { res.status(500).json({ error:err.message }); }
});

router.get('/stats', auth, async (req,res) => {
  try {
    const [total, active, vip] = await Promise.all([
      Customer.countDocuments(),
      Customer.countDocuments({ status:'ACTIVE' }),
      Customer.countDocuments({ loyalty:'VIP' }),
    ]);
    const avg = await Customer.aggregate([{ $group:{ _id:null, avg:{ $avg:'$spent' } } }]);
    res.json({ total, active, vip, avgSpent:avg[0]?.avg||0 });
  } catch(err) { res.status(500).json({ error:err.message }); }
});

router.get('/:id', auth, async (req,res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error:'Customer not found' });
    }

    const orders = await Order.find({
      customer: req.params.id
    })
    .populate({
      path: 'items.product',
      select: 'name image price category'
    })
    .sort({ date: -1 })
    .limit(10);

    const recommendedProducts = [];

    orders.forEach(order => {
      order.items.forEach(item => {
        if (
          item.product &&
          !recommendedProducts.find(
            p => p._id.toString() === item.product._id.toString()
          )
        ) {
          recommendedProducts.push(item.product);
        }
      });
    });

    res.json({
      ...customer.toObject(),
      orderHistory: orders,
      recommendedProducts
    });

  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req,res) => {
  try {
    const data = { ...req.body };
    // Always recompute avatar from name
    if (data.name) data.avatar = computeAvatar(data.name);
    const c = await Customer.findByIdAndUpdate(req.params.id, data, { new:true, runValidators:true });
    res.json(c);
  } catch(err) { res.status(400).json({ error:err.message }); }
});

router.post('/', auth, async (req,res) => {
  try {
    const c = await Customer.create(req.body);
    res.status(201).json(c);
  } catch(err) { res.status(400).json({ error:err.message }); }
});

router.delete('/:id', auth, async (req,res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message:'Customer deleted' });
  } catch(err) { res.status(500).json({ error:err.message }); }
});

export default router;
