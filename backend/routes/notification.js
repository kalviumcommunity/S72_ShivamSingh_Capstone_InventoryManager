const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserNotifications,
  markAsRead,
  archiveNotification,
  getUnreadCount
} = require('../controllers/notificationController');

// Apply authentication middleware to all routes
router.use(protect);

// Get user's notifications
router.get('/', getUserNotifications);

// Get unread notification count
router.get('/unread-count', getUnreadCount);

// Mark notification as read
router.patch('/:id/read', markAsRead);

// Archive notification
router.patch('/:id/archive', archiveNotification);

module.exports = router; 