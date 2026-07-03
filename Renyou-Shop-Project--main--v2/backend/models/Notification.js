import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'danger', 'success'], default: 'info' },
  icon: { type: String },
  read: { type: Boolean, default: false },
  link: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
