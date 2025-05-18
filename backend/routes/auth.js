const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  getMe,
  updateProfile,
  googleAuth
} = require('../controllers/authController');

// Debug middleware
router.use((req, res, next) => {
  console.log('Auth Route accessed:', req.method, req.path);
  next();
});

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/google', googleAuth);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.patch('/update-password', updatePassword);
router.put('/update-profile', updateProfile);

module.exports = router; 