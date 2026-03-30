import express from 'express';

import {
  createHealthLog,
  deleteHealthLog,
  getHealthLogs,
  getLogAnalytics,
  updateHealthLog
} from '../controllers/healthLogController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/analytics', getLogAnalytics);
router.route('/').post(createHealthLog).get(getHealthLogs);
router.route('/:id').put(updateHealthLog).delete(deleteHealthLog);

export default router;
