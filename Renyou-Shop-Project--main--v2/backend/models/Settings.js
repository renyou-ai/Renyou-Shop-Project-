import mongoose from 'mongoose';

export const STORE_SETTINGS_ID = '000000000000000000000000';

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },

  // ── General ──
  storeName:    { type: String, default: 'Renyou Shop' },
  supportEmail: { type: String, default: 'support@renyou.com' },

  baseCurrency: { type: String, default: 'USD' },
  currency:     { type: String, default: 'USD' },

  language:     { type: String, default: 'en' },
  timezone:     { type: String, default: 'UTC' },

  // ── Appearance ──
  themeColor:   { type: String, default: '#524E8D' },
  sidebarWidth: { type: String, default: 'Normal' },
  darkMode:     { type: Boolean, default: false },

  // ── Notifications ──
  notifications: {
    stockAlert:   { type: Boolean, default: true },
    newOrder:     { type: Boolean, default: true },
    newCustomer:  { type: Boolean, default: false },
    promotionEnd: { type: Boolean, default: true },
  },

  // ── Security ──
  security: {
    twoFactor:      { type: Boolean, default: false },
    sessionTimeout: { type: String,  default: '8h'  },
    ipWhitelist:    { type: Boolean, default: false },
  },

  rates: {
    type: Map,
    of: Number,
    default: undefined,
  },

}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
