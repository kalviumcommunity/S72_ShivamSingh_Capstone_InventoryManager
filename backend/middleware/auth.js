const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Protect routes - Authentication check
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Restrict to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'store-manager']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

// Check if user has access to specific resource
exports.checkResourceAccess = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params[paramName]);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found.'
        });
      }

      // Store Manager has access to everything
      if (req.user.role === 'Store Manager') {
        req.resource = resource;
        return next();
      }

      // Staff can only access resources they created
      if (resource.createdBy && resource.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource.'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error checking resource access.'
      });
    }
  };
};

// Rate limiting middleware
exports.rateLimit = (windowMs, max) => {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    req.rateLimit = req.rateLimit || {};
    Object.keys(req.rateLimit).forEach(ip => {
      if (req.rateLimit[ip] < windowStart) {
        delete req.rateLimit[ip];
      }
    });

    // Check if user has exceeded rate limit
    if (req.rateLimit[key] && req.rateLimit[key] >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    // Update rate limit
    req.rateLimit[key] = now;
    next();
  };
};

// Notification middleware
exports.createNotification = async (type, title, message, recipients, metadata = {}) => {
  try {
    const notification = await Notification.create({
      type,
      title,
      message,
      recipients: recipients.map(userId => ({ user: userId })),
      metadata
    });

    // Emit notification to connected clients
    const io = req.app.get('io');
    if (io) {
      recipients.forEach(userId => {
        io.to(userId.toString()).emit('newNotification', notification);
      });
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

exports.isLoggedIn = async (req, res, next) => {
  try {
    // 1) verify token
    if (req.cookies.jwt) {
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    }
    next();
  } catch (err) {
    next();
  }
}; 