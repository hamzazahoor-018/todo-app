const authService = require('../services/authService');

const accessTokenMaxAge = 15 * 60 * 1000;
const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge
});

const setAuthCookies = (res, tokens) => {
  res.cookie('refreshToken', tokens.refreshToken, cookieOptions(refreshTokenMaxAge));
  res.cookie('accessToken', tokens.accessToken, cookieOptions(accessTokenMaxAge));
};

const clearAuthCookies = (res) => {
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
};

const sendAuthError = (res, error, fallbackMessage) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode ? error.message : fallbackMessage,
    error: error.statusCode ? undefined : error.message
  });
};

// Signup Controller
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.signup(email, password);

    setAuthCookies(res, tokens);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        accessToken: tokens.accessToken
      }
    });
  } catch (error) {
    return sendAuthError(res, error, 'Signup failed');
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.login(email, password);

    setAuthCookies(res, tokens);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        accessToken: tokens.accessToken
      }
    });
  } catch (error) {
    return sendAuthError(res, error, 'Login failed');
  }
};

// Refresh Token Controller
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const { tokens } = await authService.refreshAccessToken(refreshToken);

    setAuthCookies(res, tokens);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: tokens.accessToken
      }
    });
  } catch (error) {
    return sendAuthError(res, error, 'Token refresh failed');
  }
};

// Logout Controller
const logout = async (req, res) => {
  try {
    await authService.logout(req.user?.userId);
    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    return sendAuthError(res, error, 'Logout failed');
  }
};

module.exports = {
  signup,
  login,
  logout,
  refreshAccessToken
};
