const AppError = require('../utils/AppError');

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user?.role || !roles.includes(req.user.role)) {
    return next(new AppError(403, 'You do not have permission to perform this action'));
  }

  next();
};

module.exports = requireRole;
