import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    age: {
      type: Number,
      min: 0,
      default: null
    },
    weight: {
      type: Number,
      min: 0,
      default: null
    },
    height: {
      type: Number,
      min: 0,
      default: null
    },
    goalSummary: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: 6,
      select: false
    },
    profile: {
      type: profileSchema,
      default: () => ({})
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    }
  }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
