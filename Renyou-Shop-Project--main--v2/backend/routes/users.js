import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars');
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `avatar-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

const upload = multer({ storage });

router.get('/', auth, async (req, res) => {
  try {
    const { search, role, status } = req.query;
    const filter = {};
    if (search) filter.$or = [{ name:{$regex:search,$options:'i'} }, { email:{$regex:search,$options:'i'} }];
    if (role) filter.role = role;
    if (status) filter.status = status;
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/users/me — update profile (MUST be before /:id)
router.put('/me', auth, async (req, res) => {
  try {

const data = {};

if (
  typeof req.body.username === "string"
) {
  data.username = req.body.username;
}

if (
  typeof req.body.phone === "string"
) {
  data.phone = req.body.phone;
}

if (
  typeof req.body.avatar === "string"
) {
  data.avatar = req.body.avatar;
}

if (
  typeof req.body.email === "string" &&
  req.body.email.trim() !== ""
) {
  data.email = req.body.email.trim().toLowerCase();
}

if (req.body.name) {
  data.name = req.body.name;
}

    const currentUser = await User.findById(req.user._id);

    if (data.name) {
      const parts = data.name.trim().split(/\s+/).filter(Boolean);
      data.initials =
        parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : data.name.slice(0, 2).toUpperCase();
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: data },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/users/me/settings
router.get('/me/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json(user.settings || {});
  } catch (err) {
    console.error('Get settings error:', err.message);
    res.status(500).json({
      error: err.message,
    });
  }
});

// PUT /api/users/me/settings — deep merge settings (MUST be before /:id)
router.put('/me/settings', auth, async (req, res) => {
  try {
    // Strategy: load current user, merge settings, save with findByIdAndUpdate
    const current = await User.findById(req.user._id);
    if (!current) return res.status(404).json({ error: 'User not found' });

    const s = req.body;

    // Build the merged settings object
    const currentSettings = current.settings?.toObject?.() || current.settings || {};
    const merged = {
      currency:     s.currency     !== undefined ? s.currency     : (currentSettings.currency     || 'USD'),
      language:     s.language     !== undefined ? s.language     : (currentSettings.language     || 'en'),
      timezone:     s.timezone     !== undefined ? s.timezone     : (currentSettings.timezone     || 'UTC'),
      themeColor:   s.themeColor   !== undefined ? s.themeColor   : (currentSettings.themeColor   || '#524E8D'),
      sidebarWidth: s.sidebarWidth !== undefined ? s.sidebarWidth : (currentSettings.sidebarWidth || 'Normal'),
      notifications: {
        stockAlert:   s.notifications?.stockAlert   !== undefined ? s.notifications.stockAlert   : (currentSettings.notifications?.stockAlert   ?? true),
        newOrder:     s.notifications?.newOrder     !== undefined ? s.notifications.newOrder     : (currentSettings.notifications?.newOrder     ?? true),
        newCustomer:  s.notifications?.newCustomer  !== undefined ? s.notifications.newCustomer  : (currentSettings.notifications?.newCustomer  ?? false),
        promotionEnd: s.notifications?.promotionEnd !== undefined ? s.notifications.promotionEnd : (currentSettings.notifications?.promotionEnd ?? true),
      },
      security: {
        twoFactor:      s.security?.twoFactor      !== undefined ? s.security.twoFactor      : (currentSettings.security?.twoFactor      ?? false),
        sessionTimeout: s.security?.sessionTimeout !== undefined ? s.security.sessionTimeout : (currentSettings.security?.sessionTimeout ?? '8h'),
        ipWhitelist:    s.security?.ipWhitelist    !== undefined ? s.security.ipWhitelist    : (currentSettings.security?.ipWhitelist    ?? false),
      },
    };

    // Save full settings object (avoids partial $set issues with subdocuments)
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { settings: merged } },
      { new: true }
    ).select('-password');

    res.json(user.settings);
  } catch(err) {
    console.error('Settings error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

router.post(
  '/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded'
        });
      }

      const avatar =
        `/uploads/avatars/${req.file.filename}`;

      await User.findByIdAndUpdate(
        req.user._id,
        { avatar }
      );

      res.json({
        avatar
      });

    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }
);

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.create(req.body);
    const u = user.toObject(); delete u.password;
    res.status(201).json(u);
  } catch(err) { res.status(400).json({ error: err.message }); }
});

// /:id AFTER /me routes
router.put('/:id', auth, async (req, res) => {
  try {
    const { password, ...data } = req.body;
    if (data.name) {
      const parts = data.name.trim().split(/\s+/).filter(Boolean);
      data.initials = parts.length >= 2
        ? (parts[0][0] + parts[parts.length-1][0]).toUpperCase()
        : data.name.slice(0, 2).toUpperCase();
    }
    const user = await User.findByIdAndUpdate(req.params.id, { $set: data }, { new: true }).select('-password');
    res.json(user);
  } catch(err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id)
      return res.status(400).json({ error: 'Cannot delete your own account' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

export default router;
