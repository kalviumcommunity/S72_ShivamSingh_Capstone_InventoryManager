const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Customer email is required'],
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: [true, 'Customer phone is required'],
        trim: true,
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: [true, 'Price is required'],
          min: [0, 'Price cannot be negative'],
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
    tax: {
      type: Number,
      required: true,
      min: [0, 'Tax cannot be negative'],
    },
    shipping: {
      type: Number,
      required: true,
      min: [0, 'Shipping cost cannot be negative'],
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit_card', 'debit_card', 'upi', 'net_banking'],
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient querying
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD${year}${month}${day}${random}`;
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  // Calculate subtotal for each item
  this.items.forEach(item => {
    item.subtotal = item.quantity * item.price;
  });

  // Calculate order subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);

  // Calculate total with tax and shipping
  this.total = this.subtotal + this.tax + this.shipping;
  next();
});

// Instance method to update order status
orderSchema.methods.updateStatus = async function(newStatus) {
  this.orderStatus = newStatus;
  await this.save();
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ orderStatus: status });
};

// Static method to find orders by date range
orderSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });
};

const Order = mongoose.model('Order', orderSchema);
module.exports = Order; 