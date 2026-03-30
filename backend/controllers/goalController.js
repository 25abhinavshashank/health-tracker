import Goal from '../models/Goal.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json({
    message: 'Goal created successfully.',
    goal
  });
});

export const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({
    isCompleted: 1,
    createdAt: -1
  });

  res.status(200).json({
    goals
  });
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!goal) {
    const error = new Error('Goal not found.');
    error.statusCode = 404;
    throw error;
  }

  // Whitelist goal fields that a user is allowed to update.
  const allowedFields = [
    'type',
    'title',
    'targetValue',
    'currentValue',
    'unit',
    'dueDate',
    'notes',
    'isCompleted'
  ];

  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  Object.assign(goal, updates);
  const updatedGoal = await goal.save();

  res.status(200).json({
    message: 'Goal updated successfully.',
    goal: updatedGoal
  });
});

export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!goal) {
    const error = new Error('Goal not found.');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    message: 'Goal deleted successfully.'
  });
});
