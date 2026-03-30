import jwt from 'jsonwebtoken';

import RefreshToken from '../models/RefreshToken.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  getRefreshCookieOptions,
  hashToken,
  issueAuthTokens
} from '../utils/tokenUtils.js';

const sendAuthResponse = async (user, req, res, statusCode = 200) => {
  const { accessToken, refreshToken } = await issueAuthTokens({ user, req });

  res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());
  res.status(statusCode).json({
    message: 'Authentication successful.',
    accessToken,
    user
  });
};

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, profile = {} } = req.body;

  if (!fullName || !email || !password) {
    const error = new Error('Full name, email, and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: email?.toLowerCase() });
  if (existingUser) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    fullName,
    email,
    password,
    profile
  });

  await sendAuthResponse(user, req, res, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email?.toLowerCase() }).select(
    '+password'
  );

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const sanitizedUser = await User.findById(user._id);
  await sendAuthResponse(sanitizedUser, req, res);
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    const error = new Error('Refresh token is missing.');
    error.statusCode = 401;
    throw error;
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (_error) {
    const error = new Error('Refresh token is invalid or expired.');
    error.statusCode = 401;
    throw error;
  }

  const tokenHash = hashToken(refreshToken);
  const storedToken = await RefreshToken.findOne({
    tokenHash,
    isRevoked: false,
    expiresAt: { $gt: new Date() }
  });

  if (!storedToken) {
    const error = new Error('Refresh token is no longer valid.');
    error.statusCode = 401;
    throw error;
  }

  storedToken.isRevoked = true;
  await storedToken.save();

  const user = await User.findById(decoded.sub);
  if (!user) {
    const error = new Error('User account no longer exists.');
    error.statusCode = 401;
    throw error;
  }

  await sendAuthResponse(user, req, res);
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await RefreshToken.findOneAndUpdate(
      { tokenHash: hashToken(refreshToken) },
      { isRevoked: true }
    );
  }

  res.clearCookie('refreshToken', getRefreshCookieOptions());
  res.status(200).json({ message: 'Logged out successfully.' });
});
