const authService = require('../services/authService');

const accessTokenMaxAge = 15 * 60 * 1000;
const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
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

const signup = async (req, res) => {
  const { email, password, name, role } = req.body;
  const { user, tokens } = await authService.signup(email, password, name, role);

  setAuthCookies(res, tokens);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.toJSON(),
      accessToken: tokens.accessToken
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.login(email, password);

  setAuthCookies(res, tokens);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toJSON(),
      accessToken: tokens.accessToken
    }
  });
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const { tokens } = await authService.refreshAccessToken(refreshToken);

  setAuthCookies(res, tokens);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken: tokens.accessToken
    }
  });
};

const logout = async (req, res) => {
  await authService.logout(req.user?.userId);
  clearAuthCookies(res);

  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};

module.exports = {
  signup,
  login,
  logout,
  refreshAccessToken
};
