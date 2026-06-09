const API_PREFIXES = ['/auth', '/todo', '/tests', '/submissions'];

const notFoundHandler = (req, res) => {
  const isApiRoute = API_PREFIXES.some((prefix) => req.path.startsWith(prefix));

  if (isApiRoute) {
    return res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  }

  return res.status(404).send('Page not found');
};

module.exports = notFoundHandler;
