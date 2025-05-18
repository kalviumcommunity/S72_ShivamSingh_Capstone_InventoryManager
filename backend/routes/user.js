const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Protected routes (require authentication)
router.use(protect);

// User routes (for logged-in users)
router.patch('/update-password', updatePassword);
router.patch('/update-me', updateMe);
router.delete('/delete-me', deleteMe);

// Admin only routes
router.use(restrictTo('admin'));

router
  .route('/')
  .get(getAllUsers);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router; 