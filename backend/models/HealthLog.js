import mongoose from 'mongoose';

const healthLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true
    },
    caloriesIntake: {
      type: Number,
      min: 0,
      required: true
    },
    waterIntakeLiters: {
      type: Number,
      min: 0,
      required: true
    },
    steps: {
      type: Number,
      min: 0,
      default: 0
    },
    exerciseMinutes: {
      type: Number,
      min: 0,
      default: 0
    },
    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
      required: true
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

healthLogSchema.index({ user: 1, date: 1 }, { unique: true });

const HealthLog = mongoose.model('HealthLog', healthLogSchema);

export default HealthLog;
