const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmailNotification } = require('../utils/emailService');

// Get user's notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      'recipients.user': req.user._id
    })
    .sort({ createdAt: -1 })
    .limit(50);

    res.status(200).json({
      status: 'success',
      data: {
        notifications
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching notifications'
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    // Update recipient's read status
    const recipientIndex = notification.recipients.findIndex(
      recipient => recipient.user.toString() === req.user._id.toString()
    );

    if (recipientIndex === -1) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to read this notification'
      });
    }

    notification.recipients[recipientIndex].read = true;
    notification.recipients[recipientIndex].readAt = new Date();

    // Update overall status if all recipients have read
    if (notification.recipients.every(recipient => recipient.read)) {
      notification.status = 'Read';
    }

    await notification.save();

    res.status(200).json({
      status: 'success',
      data: {
        notification
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error marking notification as read'
    });
  }
};

// Archive notification
exports.archiveNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    // Check if user is a recipient
    const isRecipient = notification.recipients.some(
      recipient => recipient.user.toString() === req.user._id.toString()
    );

    if (!isRecipient) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to archive this notification'
      });
    }

    notification.status = 'Archived';
    await notification.save();

    res.status(200).json({
      status: 'success',
      data: {
        notification
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error archiving notification'
    });
  }
};

// Create notification
exports.createNotification = async (type, title, message, recipients, relatedEntity = null) => {
  try {
    const notification = await Notification.create({
      type,
      title,
      message,
      recipients: recipients.map(userId => ({ user: userId })),
      relatedEntity
    });

    // Send email notifications
    for (const recipient of recipients) {
      await sendEmailNotification(notification);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      'recipients.user': req.user._id,
      'recipients.read': false
    });

    res.status(200).json({
      status: 'success',
      data: {
        count
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching unread notification count'
    });
  }
}; 