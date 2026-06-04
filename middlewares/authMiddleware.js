const { verifyAccessToken } = require('../utils/jwt');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header or cookies
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.'
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.'
      });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

module.exports = authMiddleware;
