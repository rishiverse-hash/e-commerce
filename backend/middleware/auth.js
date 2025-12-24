const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/AppError');
const { asyncHandler } = require('../utils/asyncHandler');

// Protect routes - verify JWT token
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token in cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Access denied. No token provided.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      return next(new AppError('User not found. Token may be invalid.', 401));
    }

    // Check if user account is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 401));
    }

    // Check if user account is locked
    if (user.isLocked()) {
      return next(new AppError('Your account is temporarily locked due to multiple failed login attempts.', 423));
    }

    // Check if email is verified (optional - can be configured)
    if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true' && !user.isEmailVerified) {
      return next(new AppError('Please verify your email address to access this resource.', 403));
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    } else if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please log in again.', 401));
    }
    return next(new AppError('Token verification failed.', 401));
  }
});

// Optional authentication - doesn't fail if no token
exports.optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user && user.isActive && !user.isLocked()) {
        req.user = user;
      }
    } catch (error) {
      // Silently fail for optional auth
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
});

// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied. Insufficient permissions.', 403));
    }

    next();
  };
};

// Admin only middleware
exports.adminOnly = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required.', 401));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError('Access denied. Admin privileges required.', 403));
  }

  next();
};

// Check if user owns resource or is admin
exports.ownerOrAdmin = (resourceUserField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.resource ? req.resource[resourceUserField] : req.params.userId;
    
    if (!resourceUserId) {
      return next(new AppError('Resource ownership cannot be determined.', 400));
    }

    if (resourceUserId.toString() !== req.user._id.toString()) {
      return next(new AppError('Access denied. You can only access your own resources.', 403));
    }

    next();
  };
};

// Verify refresh token
exports.verifyRefreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh token is required.', 400));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Get user and check if refresh token exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new AppError('Invalid refresh token.', 401));
    }

    // Check if refresh token exists in user's tokens array
    const tokenExists = user.refreshTokens.some(tokenObj => tokenObj.token === refreshToken);
    
    if (!tokenExists) {
      return next(new AppError('Invalid refresh token.', 401));
    }

    // Check if user account is active
    if (!user.isActive) {
      return next(new AppError('Account deactivated.', 401));
    }

    req.user = user;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid refresh token.', 401));
    } else if (error.name === 'TokenExpiredError') {
      return next(new AppError('Refresh token expired. Please log in again.', 401));
    }
    return next(new AppError('Refresh token verification failed.', 401));
  }
});

// Rate limiting for sensitive operations
exports.sensitiveOperationLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.user ? req.user._id.toString() : req.ip;
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const userAttempts = attempts.get(key);
    
    if (now > userAttempts.resetTime) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userAttempts.count >= maxAttempts) {
      return next(new AppError(`Too many attempts. Please try again later.`, 429));
    }

    userAttempts.count++;
    next();
  };
};

// Middleware to check if user can perform action on specific resource
exports.checkResourceAccess = (Model, resourceParam = 'id', userField = 'user') => {
  return asyncHandler(async (req, res, next) => {
    const resourceId = req.params[resourceParam];
    const resource = await Model.findById(resourceId);

    if (!resource) {
      return next(new AppError('Resource not found.', 404));
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      req.resource = resource;
      return next();
    }

    // Check if user owns the resource
    if (resource[userField].toString() !== req.user._id.toString()) {
      return next(new AppError('Access denied. You can only access your own resources.', 403));
    }

    req.resource = resource;
    next();
  });
};