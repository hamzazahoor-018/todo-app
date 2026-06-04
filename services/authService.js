const User = require('../models/User');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt');

const createAuthError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const signup = async (email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createAuthError(409, 'User already exists with this email');
  }

  const user = new User({ email, password });
  await user.save();

  const tokens = generateTokens(user._id, user.email);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { user, tokens };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createAuthError(401, 'Invalid email or password');
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw createAuthError(401, 'Invalid email or password');
  }

  const tokens = generateTokens(user._id, user.email);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { user, tokens };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createAuthError(401, 'Refresh token not provided');
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw createAuthError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw createAuthError(401, 'Refresh token mismatch');
  }

  const tokens = generateTokens(user._id, user.email);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { user, tokens };
};

const logout = async (userId) => {
  if (!userId) {
    return;
  }

  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

module.exports = {
  signup,
  login,
  refreshAccessToken,
  logout
};
