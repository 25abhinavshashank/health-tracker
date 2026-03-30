import HealthLog from '../models/HealthLog.js';
import asyncHandler from '../utils/asyncHandler.js';
import { buildDateSeries, formatDateKey, normalizeDate } from '../utils/dateUtils.js';

const mapAnalyticsResponse = (logs, days) => {
  const series = buildDateSeries(days).map((date) => ({
    label: formatDateKey(date),
    caloriesIntake: 0,
    waterIntakeLiters: 0,
    steps: 0,
    exerciseMinutes: 0,
    sleepHours: 0
  }));

  const lookup = new Map(series.map((entry) => [entry.label, entry]));

  logs.forEach((log) => {
    const key = formatDateKey(log.date);
    const current = lookup.get(key);

    if (current) {
      current.caloriesIntake = log.caloriesIntake;
      current.waterIntakeLiters = log.waterIntakeLiters;
      current.steps = log.steps;
      current.exerciseMinutes = log.exerciseMinutes;
      current.sleepHours = log.sleepHours;
    }
  });

  return series;
};

export const createHealthLog = asyncHandler(async (req, res) => {
  const {
    date,
    caloriesIntake,
    waterIntakeLiters,
    steps,
    exerciseMinutes,
    sleepHours,
    notes
  } = req.body;

  const normalizedDate = normalizeDate(date);

  const existingLog = await HealthLog.findOne({
    user: req.user._id,
    date: normalizedDate
  });

  if (existingLog) {
    const error = new Error('A health log already exists for this date.');
    error.statusCode = 409;
    throw error;
  }

  const log = await HealthLog.create({
    user: req.user._id,
    date: normalizedDate,
    caloriesIntake,
    waterIntakeLiters,
    steps,
    exerciseMinutes,
    sleepHours,
    notes
  });

  res.status(201).json({
    message: 'Health log created successfully.',
    log
  });
});

export const getHealthLogs = asyncHandler(async (req, res) => {
  const { from, to, limit } = req.query;

  const filter = {
    user: req.user._id
  };

  if (from || to) {
    filter.date = {};

    if (from) {
      filter.date.$gte = normalizeDate(from);
    }

    if (to) {
      filter.date.$lte = normalizeDate(to);
    }
  }

  const query = HealthLog.find(filter).sort({ date: -1 });

  if (limit) {
    query.limit(Number(limit));
  }

  const logs = await query;

  res.status(200).json({
    logs
  });
});

export const updateHealthLog = asyncHandler(async (req, res) => {
  const log = await HealthLog.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!log) {
    const error = new Error('Health log not found.');
    error.statusCode = 404;
    throw error;
  }

  // Only allow updating user-editable fields to prevent privilege escalation.
  const allowedFields = [
    'date',
    'caloriesIntake',
    'waterIntakeLiters',
    'steps',
    'exerciseMinutes',
    'sleepHours',
    'notes'
  ];

  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (updates.date) {
    updates.date = normalizeDate(updates.date);

    const duplicateLog = await HealthLog.findOne({
      _id: { $ne: log._id },
      user: req.user._id,
      date: updates.date
    });

    if (duplicateLog) {
      const error = new Error('A health log already exists for this date.');
      error.statusCode = 409;
      throw error;
    }
  }

  Object.assign(log, updates);
  const updatedLog = await log.save();

  res.status(200).json({
    message: 'Health log updated successfully.',
    log: updatedLog
  });
});

export const deleteHealthLog = asyncHandler(async (req, res) => {
  const log = await HealthLog.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!log) {
    const error = new Error('Health log not found.');
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    message: 'Health log deleted successfully.'
  });
});

export const getLogAnalytics = asyncHandler(async (req, res) => {
  const range = req.query.range === 'monthly' ? 'monthly' : 'weekly';
  const days = range === 'monthly' ? 30 : 7;
  const dateSeries = buildDateSeries(days);

  const logs = await HealthLog.find({
    user: req.user._id,
    date: {
      $gte: dateSeries[0],
      $lte: dateSeries[dateSeries.length - 1]
    }
  }).sort({ date: 1 });

  const series = mapAnalyticsResponse(logs, days);

  const totals = series.reduce(
    (accumulator, entry) => ({
      caloriesIntake: accumulator.caloriesIntake + entry.caloriesIntake,
      waterIntakeLiters: accumulator.waterIntakeLiters + entry.waterIntakeLiters,
      steps: accumulator.steps + entry.steps,
      exerciseMinutes: accumulator.exerciseMinutes + entry.exerciseMinutes,
      sleepHours: accumulator.sleepHours + entry.sleepHours
    }),
    {
      caloriesIntake: 0,
      waterIntakeLiters: 0,
      steps: 0,
      exerciseMinutes: 0,
      sleepHours: 0
    }
  );

  res.status(200).json({
    range,
    series,
    averages: {
      caloriesIntake: Number((totals.caloriesIntake / days).toFixed(2)),
      waterIntakeLiters: Number((totals.waterIntakeLiters / days).toFixed(2)),
      steps: Number((totals.steps / days).toFixed(2)),
      exerciseMinutes: Number((totals.exerciseMinutes / days).toFixed(2)),
      sleepHours: Number((totals.sleepHours / days).toFixed(2))
    }
  });
});
