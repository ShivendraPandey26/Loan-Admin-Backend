export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Handle invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  // Handle duplicate fields
  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
  }

  // Avoid exposing internal error details in production
  if (statusCode >= 500 && process.env.NODE_ENV === "production") {
    message = "Internal server error";
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
}