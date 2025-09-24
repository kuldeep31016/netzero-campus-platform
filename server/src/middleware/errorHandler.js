const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.user?.email,
    timestamp: new Date().toISOString()
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value for ${field}. Please use another value.`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
    error = { message, statusCode: 400 };
  }

  // Firebase auth errors
  if (err.code && err.code.startsWith('auth/')) {
    const firebaseErrorMessages = {
      'auth/id-token-expired': 'Your session has expired. Please login again.',
      'auth/id-token-revoked': 'Your session has been revoked. Please login again.',
      'auth/invalid-id-token': 'Invalid authentication token.',
      'auth/user-not-found': 'User account not found.',
      'auth/email-already-exists': 'An account with this email already exists.',
      'auth/email-not-found': 'No account found with this email address.',
      'auth/invalid-email': 'Invalid email address format.',
      'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
      'auth/user-disabled': 'This user account has been disabled.',
      'auth/too-many-requests': 'Too many requests. Please try again later.',
    };

    const message = firebaseErrorMessages[err.code] || 'Authentication error occurred.';
    error = { message, statusCode: 401 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please login again.';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please login again.';
    error = { message, statusCode: 401 };
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = 'Too many requests. Please try again later.';
    error = { message, statusCode: 429 };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large. Maximum size is 10MB.';
    error = { message, statusCode: 400 };
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    const message = 'Too many files. Maximum 10 files allowed.';
    error = { message, statusCode: 400 };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field.';
    error = { message, statusCode: 400 };
  }

  // MongoDB connection errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    const message = 'Database connection error. Please try again later.';
    error = { message, statusCode: 503 };
  }

  // OpenAI API errors
  if (err.response && err.response.status) {
    if (err.response.status === 429) {
      const message = 'AI service is busy. Please try again later.';
      error = { message, statusCode: 503 };
    } else if (err.response.status === 401) {
      const message = 'AI service configuration error.';
      error = { message, statusCode: 503 };
    }
  }

  // Development vs Production error responses
  const isDevelopment = process.env.NODE_ENV === 'development';

  const errorResponse = {
    status: 'error',
    message: error.message || 'Internal server error',
    ...(isDevelopment && {
      error: err,
      stack: err.stack,
      details: {
        url: req.url,
        method: req.method,
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query
      }
    })
  };

  res.status(error.statusCode || 500).json(errorResponse);
};

// 404 handler for undefined routes
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
  }
}

class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable') {
    super(message, 503);
  }
}

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ServiceUnavailableError
};