const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { createNotification } = require('../middleware/auth');
const Email = require('../utils/email');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user
    }
  });
};

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image file.'), false);
    }
  }
}).single('profileImage');

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm, companyName, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      companyName,
      role: role || 'Staff' // Use provided role or default to Staff
    });

    // Create welcome notification
    await createNotification(
      'System Alert',
      'Welcome to Inventory Management System',
      `Welcome ${user.name}! Your account has been created successfully.`,
      [user._id]
    );

    createSendToken(user, 201, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log the login attempt
    console.log('Login attempt:', { email });

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      user
    });
  } catch (error) {
    console.warn('Login error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request received for email:', req.body.email);
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(404).json({
        success: false,
        message: 'There is no user with that email address'
      });
    }

    console.log('User found, generating reset token');
    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL using frontend URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('Reset URL generated:', resetURL);

    // Send reset email
    try {
      console.log('Attempting to send email to:', user.email);
      const email = new Email(user, resetURL);
      await email.sendPasswordReset();
      console.log('Email sent successfully');

      res.status(200).json({
        success: true,
        message: 'Password reset token sent to email'
      });
    } catch (err) {
      console.error('Error sending email:', err);
      // If email sending fails, clear the reset token
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'There was an error sending the email. Try again later!',
        error: err.message
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired'
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Create notification
    await createNotification(
      'System Alert',
      'Password Reset Successful',
      'Your password has been reset successfully.',
      [user._id]
    );

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    // Check if current password is correct
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Your current password is wrong'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Create notification
    await createNotification(
      'System Alert',
      'Password Updated',
      'Your password has been updated successfully.',
      [user._id]
    );

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    // Handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      const { name, email, companyName } = req.body;
      
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user._id } 
      });

      if (existingUser) {
        // Remove uploaded file if email is taken
        if (req.file) {
          await fs.unlink(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: 'Email already in use by another account'
        });
      }

      // Prepare update data
      const updateData = {
        name,
        email,
        companyName: companyName || ''
      };

      // Add profile image path if file was uploaded
      if (req.file) {
        // Delete old profile image if it exists
        if (req.user.profileImage) {
          try {
            await fs.unlink(path.join('uploads/profiles/', path.basename(req.user.profileImage)));
          } catch (error) {
            console.error('Error deleting old profile image:', error);
          }
        }
        updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
      }

      // Find user and update
      const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        // Remove uploaded file if user not found
        if (req.file) {
          await fs.unlink(req.file.path);
        }
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Remove sensitive data from response
      user.password = undefined;

      // Create notification for profile update
      await createNotification(
        'Profile Updated',
        'Profile Update Successful',
        `Your profile has been updated successfully.`,
        [user._id]
      );

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            companyName: user.companyName,
            role: user.role,
            profileImage: user.profileImage
          }
        }
      });
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
};

// Google Authentication
exports.googleAuth = async (req, res) => {
  try {
    const { firebaseUid, email, name, idToken } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        firebaseUid,
        role: 'Staff',
        password: crypto.randomBytes(32).toString('hex'), // Generate random password
        passwordConfirm: undefined // Skip password validation
      });
    } else {
      // Update existing user's Firebase UID if not set
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        await user.save({ validateBeforeSave: false });
      }
    }

    // Generate JWT token
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      user
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error during Google authentication'
    });
  }
};

module.exports = {
  register: exports.register,
  login: exports.login,
  forgotPassword: exports.forgotPassword,
  resetPassword: exports.resetPassword,
  updatePassword: exports.updatePassword,
  getMe: exports.getMe,
  updateProfile: exports.updateProfile,
  googleAuth: exports.googleAuth
}; 