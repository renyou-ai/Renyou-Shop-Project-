import express from 'express';
import {
  getSettings, updateSettings,
  getStoreSettings, updateStoreSettings,
} from '../controllers/settingsController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getSettings);
router.put('/', auth, updateSettings);

router.get('/store', getStoreSettings);
router.put('/store', auth, updateStoreSettings);

export default router;
