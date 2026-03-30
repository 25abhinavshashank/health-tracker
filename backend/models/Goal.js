import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: [
        'weight_loss',
        'weight_gain',
        'maintenance',
        'calorie_target',
        'water_target',
        'sleep_target',
        'steps_target',
        'exercise_target'
      ],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    targetValue: {
      type: Number,
      min: 0,
      required: true
    },
    currentValue: {
      type: Number,
      min: 0,
      default: 0
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    dueDate: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
