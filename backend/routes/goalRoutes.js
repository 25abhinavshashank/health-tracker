import express from 'express';

import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal
} from '../controllers/goalController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').post(createGoal).get(getGoals);
router.route('/:id').put(updateGoal).delete(deleteGoal);

export default router;
