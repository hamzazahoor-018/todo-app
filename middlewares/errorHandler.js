// Express 5 automatically forwards rejected promises from async route handlers here.
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (statusCode === 500) {
    console.error(err);
  }

  const response = { success: false };

  // Validation errors from express-validator
  if (err.errors) {
    response.errors = err.errors;
  } else {
    response.message = err.isOperational ? err.message : 'Something went wrong!';
  }

  if (!err.isOperational && process.env.NODE_ENV !== 'production') {
    response.error = err.message;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
