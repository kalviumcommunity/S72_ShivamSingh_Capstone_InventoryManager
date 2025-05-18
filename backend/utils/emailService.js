const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email templates
const emailTemplates = {
  lowStock: (product) => ({
    subject: 'Low Stock Alert',
    html: `
      <h2>Low Stock Alert</h2>
      <p>The following product is running low on stock:</p>
      <ul>
        <li>Product: ${product.name}</li>
        <li>SKU: ${product.sku}</li>
        <li>Current Stock: ${product.currentStock}</li>
        <li>Minimum Stock: ${product.minimumStock}</li>
      </ul>
      <p>Please take necessary action to replenish the stock.</p>
    `
  }),
  expiryWarning: (product) => ({
    subject: 'Product Expiry Warning',
    html: `
      <h2>Product Expiry Warning</h2>
      <p>The following product is approaching its expiry date:</p>
      <ul>
        <li>Product: ${product.name}</li>
        <li>SKU: ${product.sku}</li>
        <li>Expiry Date: ${product.expiryDate.toLocaleDateString()}</li>
      </ul>
      <p>Please take necessary action to manage the stock.</p>
    `
  }),
  orderStatus: (order) => ({
    subject: `Order ${order.orderNumber} Status Update`,
    html: `
      <h2>Order Status Update</h2>
      <p>Order ${order.orderNumber} has been ${order.orderStatus.toLowerCase()}.</p>
      <p>Order Details:</p>
      <ul>
        <li>Total Amount: ${order.total}</li>
        <li>Status: ${order.orderStatus}</li>
      </ul>
    `
  }),
  systemAlert: (title, message) => ({
    subject: title,
    html: `<p>${message}</p>`
  })
};

// Send email notification
exports.sendEmailNotification = async (notification) => {
  try {
    // Get recipient email
    const recipient = await User.findById(notification.recipients[0].user);
    if (!recipient || !recipient.email) {
      throw new Error('Recipient email not found');
    }

    // Get email template based on notification type
    let emailContent;
    switch (notification.type) {
      case 'Low Stock':
        const product = await Product.findById(notification.relatedEntity.id);
        emailContent = emailTemplates.lowStock(product);
        break;
      case 'Expiry Warning':
        const expiringProduct = await Product.findById(notification.relatedEntity.id);
        emailContent = emailTemplates.expiryWarning(expiringProduct);
        break;
      case 'Order Status':
        const order = await Order.findById(notification.relatedEntity.id);
        emailContent = emailTemplates.orderStatus(order);
        break;
      default:
        emailContent = emailTemplates.systemAlert(notification.title, notification.message);
    }

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: recipient.email,
      subject: emailContent.subject,
      html: emailContent.html
    });

    // Update notification status
    notification.emailSent = true;
    notification.emailSentAt = new Date();
    await notification.save();

    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
};

// Process pending email notifications
exports.processPendingNotifications = async () => {
  try {
    const pendingNotifications = await Notification.find({
      emailSent: false,
      status: 'Unread'
    });

    for (const notification of pendingNotifications) {
      await exports.sendEmailNotification(notification);
    }
  } catch (error) {
    console.error('Error processing pending notifications:', error);
  }
};

// Schedule email processing
exports.scheduleEmailProcessing = () => {
  // Process pending notifications every hour
  setInterval(exports.processPendingNotifications, 60 * 60 * 1000);
}; 