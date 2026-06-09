const User = require('../models/User');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

const signup = async (email, password, name, role) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(409, 'User already exists with this email');
  }

  const user = new User({
    email,
    password,
    name: name?.trim() || email.split('@')[0],
    role: role || 'student'
  });
  await user.save();

  const tokens = generateTokens(user._id, user.email, user.role);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { user, tokens };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new AppError(401, 'Invalid email or password');
  }

  const tokens = generateTokens(user._id, user.email, user.role);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { user, tokens };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError(401, 'Refresh token not provided');
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new AppError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError(401, 'Refresh token mismatch');
  }

  const tokens = generateTokens(user._id, user.email, user.role);
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
