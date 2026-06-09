const { verifyAccessToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;

    if (!token) {
      return next(new AppError(401, 'No token provided. Please login first.'));
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return next(new AppError(401, 'Invalid or expired token. Please login again.'));
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError(401, 'Authentication failed'));
  }
};

module.exports = authMiddleware;
