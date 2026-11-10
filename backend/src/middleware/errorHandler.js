function errorHandler(err, req, res, next) {
  console.error('[Error Middleware]:', err.message || err);

  const statusCode = err.status || err.statusCode || 500;
  const message = statusCode === 500
    ? 'Internal server error occurred. Please try again later.'
    : err.message || 'An error occurred processing your request.';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};

