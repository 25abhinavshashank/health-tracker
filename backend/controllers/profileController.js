import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    user
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, profile } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  user.fullName = fullName || user.fullName;
  user.profile = {
    ...(user.profile?.toObject?.() || {}),
    ...(profile || {})
  };

  const updatedUser = await user.save();

  res.status(200).json({
    message: 'Profile updated successfully.',
    user: updatedUser
  });
});
