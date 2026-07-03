import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerId: { type:String, unique:true },
  name: { type:String, required:true },
  email: { type:String, required:true, unique:true },
  phone: { type:String },
  avatar: { type:String },
  address: { type:String },
  city: { type:String },
  country: { type:String, default:'Tunisia' },
  orders: { type:Number, default:0 },
  spent: { type:Number, default:0 },
  lastPurchase: { type:Date },
  status: { type:String, enum:['ACTIVE','INACTIVE'], default:'ACTIVE' },
  loyalty: { type:String, enum:['Bronze','Silver','Gold','VIP'], default:'Bronze' },
  notes: { type:String },
}, { timestamps:true });

function computeAvatar(name) {
  const parts = (name||'').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0]+parts[parts.length-1][0]).toUpperCase();
  return (name||'?').slice(0,2).toUpperCase();
}

customerSchema.pre('save', async function(next) {
  if (!this.customerId) {
    const count = await mongoose.model('Customer').countDocuments();
    this.customerId = `#CUS-${String(count+1000).padStart(4,'0')}`;
  }
  // Always sync avatar with name
  this.avatar = computeAvatar(this.name);
  next();
});

// Also sync on findOneAndUpdate
customerSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    doc.avatar = computeAvatar(doc.name);
    await doc.save();
  }
});

export default mongoose.model('Customer', customerSchema);
