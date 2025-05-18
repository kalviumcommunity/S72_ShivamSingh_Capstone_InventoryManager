const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Protect routes - Authentication
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Check if token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verify token
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

  // Grant access to protected route
  req.user = currentUser;
  next();
});

// Restrict to certain roles - Authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array ['admin', 'store-manager']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// Check if user is accessing their own resource
exports.checkResourceAccess = (Model) => {
  return catchAsync(async (req, res, next) => {
    const resource = await Model.findById(req.params.id);

    if (!resource) {
      return next(new AppError('No resource found with that ID', 404));
    }

    // Allow access if user is admin or store-manager
    if (req.user.role === 'admin' || req.user.role === 'store-manager') {
      return next();
    }

    // For other roles, check if they own the resource
    if (resource.createdBy.toString() !== req.user.id) {
      return next(
        new AppError('You do not have permission to access this resource', 403)
      );
    }

    next();
  });
}; 