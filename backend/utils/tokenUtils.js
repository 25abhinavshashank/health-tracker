import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import RefreshToken from '../models/RefreshToken.js';

const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export const hashToken = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');

const parseDurationToMs = (value) => {
  const parsed = Number(value);

  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  const match = /^(\d+)([smhd])$/i.exec(value);

  if (!match) {
    throw new Error(`Unsupported duration format: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * multipliers[unit];
};

export const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: parseDurationToMs(refreshTokenExpiry)
});

export const generateAccessToken = (userId) =>
  jwt.sign({ sub: userId, type: 'access' }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: accessTokenExpiry
  });

const generateRefreshTokenValue = (userId) =>
  jwt.sign({ sub: userId, type: 'refresh' }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: refreshTokenExpiry
  });

export const issueAuthTokens = async ({ user, req }) => {
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshTokenValue(user._id.toString());

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + parseDurationToMs(refreshTokenExpiry)),
    userAgent: req.get('user-agent') || '',
    ipAddress: req.ip || ''
  });

  return {
    accessToken,
    refreshToken
  };
};
