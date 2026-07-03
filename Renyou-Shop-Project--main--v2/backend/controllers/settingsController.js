import Settings, { STORE_SETTINGS_ID } from '../models/Settings.js';
import { deepMerge } from '../utils/deepMerge.js';

export async function getSettings(req, res) {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });

    if (!settings) {
      settings = await Settings.create({ userId: req.user._id });
    }

    res.json(settings);
  } catch (err) {
    console.error('[getSettings] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function updateSettings(req, res) {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    let existing = await Settings.findOne({ userId: req.user._id });
    if (!existing) {
      existing = await Settings.create({ userId: req.user._id });
    }

    const currentPlain = existing.toObject({ flattenMaps: true });
    const merged = deepMerge(currentPlain, incoming);

    delete merged._id;
    delete merged.__v;
    delete merged.userId;
    delete merged.createdAt;
    delete merged.updatedAt;

    const updated = await Settings.findOneAndUpdate(
      { userId: req.user._id },
      { $set: merged },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    console.error('[updateSettings] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function getStoreSettings(req, res) {
  try {
    let settings = await Settings.findOne({ userId: STORE_SETTINGS_ID });

    if (!settings) {
      settings = await Settings.create({ userId: STORE_SETTINGS_ID });
    }

    res.json(settings);
  } catch (err) {
    console.error('[getStoreSettings] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function updateStoreSettings(req, res) {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    let existing = await Settings.findOne({ userId: STORE_SETTINGS_ID });
    if (!existing) {
      existing = await Settings.create({ userId: STORE_SETTINGS_ID });
    }

    const currentPlain = existing.toObject({ flattenMaps: true });
    const merged = deepMerge(currentPlain, incoming);

    delete merged._id;
    delete merged.__v;
    delete merged.userId;
    delete merged.createdAt;
    delete merged.updatedAt;

    const updated = await Settings.findOneAndUpdate(
      { userId: STORE_SETTINGS_ID },
      { $set: merged },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    console.error('[updateStoreSettings] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
