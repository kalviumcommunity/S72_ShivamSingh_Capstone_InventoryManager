const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Low Stock', 'Expiry Warning', 'Order Status', 'System Alert']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  recipients: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: Date
  }],
  relatedEntity: {
    type: {
      type: String,
      enum: ['Product', 'Order', 'System']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedEntity.type'
    }
  },
  status: {
    type: String,
    enum: ['Unread', 'Read', 'Archived'],
    default: 'Unread'
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
notificationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient querying
notificationSchema.index({ recipients: 1, status: 1 });
notificationSchema.index({ emailSent: 1, status: 1 });
notificationSchema.index({ createdAt: -1 });

// Static method to create low stock notification
notificationSchema.statics.createLowStockNotification = async function(product, user) {
  return await this.create({
    type: 'Low Stock',
    title: 'Low Stock Alert',
    message: `Product "${product.name}" (SKU: ${product.sku}) is running low on stock. Current stock: ${product.currentStock}`,
    priority: product.currentStock <= product.minimumStock / 2 ? 'Critical' : 'High',
    recipients: [{ user }],
    relatedEntity: {
      type: 'Product',
      id: product._id
    },
    metadata: {
      currentStock: product.currentStock,
      minimumStock: product.minimumStock,
      sku: product.sku
    }
  });
};

// Static method to create expiry warning notification
notificationSchema.statics.createExpiryWarningNotification = async function(product, user) {
  const daysUntilExpiry = Math.ceil((product.expiryDate - new Date()) / (1000 * 60 * 60 * 24));
  
  return await this.create({
    type: 'Expiry Warning',
    title: 'Product Expiry Warning',
    message: `Product "${product.name}" (SKU: ${product.sku}) will expire in ${daysUntilExpiry} days.`,
    priority: daysUntilExpiry <= 3 ? 'Critical' : 'High',
    recipients: [{ user }],
    relatedEntity: {
      type: 'Product',
      id: product._id
    },
    metadata: {
      expiryDate: product.expiryDate,
      daysUntilExpiry,
      sku: product.sku
    }
  });
};

// Static method to create order status notification
notificationSchema.statics.createOrderStatusNotification = async function(order, user) {
  return await this.create({
    type: 'Order Status',
    title: `Order ${order.orderNumber} Status Update`,
    message: `Order ${order.orderNumber} has been ${order.orderStatus.toLowerCase()}.`,
    priority: 'Medium',
    recipients: [{ user }],
    relatedEntity: {
      type: 'Order',
      id: order._id
    },
    metadata: {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      total: order.total
    }
  });
};

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function(userId) {
  const recipient = this.recipients.find(r => r.user.toString() === userId.toString());
  if (recipient && !recipient.readAt) {
    recipient.readAt = new Date();
    await this.save();
  }
};

// Method to archive notification
notificationSchema.methods.archive = async function() {
  this.status = 'Archived';
  await this.save();
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 