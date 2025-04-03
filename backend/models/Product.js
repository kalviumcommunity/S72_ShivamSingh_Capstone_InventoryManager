const mongoose = require('mongoose');
const validator = require('validator');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product must have a name'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters'],
    },
    sku: {
      type: String,
      required: [true, 'Product must have a SKU'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product must have a description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product must have a category'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product must have a price'],
      min: [0, 'Price cannot be negative'],
    },
    cost: {
      type: Number,
      required: [true, 'Product must have a cost'],
      min: [0, 'Cost cannot be negative'],
    },
    currentStock: {
      type: Number,
      required: [true, 'Product must have a current stock'],
      min: [0, 'Stock cannot be negative'],
    },
    minimumStock: {
      type: Number,
      required: [true, 'Product must have a minimum stock level'],
      min: [0, 'Minimum stock cannot be negative'],
    },
    maximumStock: {
      type: Number,
      required: [true, 'Product must have a maximum stock level'],
      min: [0, 'Maximum stock cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Product must have a unit'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Product must have a location'],
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Product must have an expiry date'],
    },
    supplier: {
      name: {
        type: String,
        required: [true, 'Supplier name is required'],
        trim: true,
      },
      contact: {
        type: String,
        required: [true, 'Supplier contact is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Supplier email is required'],
        validate: [validator.isEmail, 'Please provide a valid email'],
      },
    },
    reorderPoint: {
      type: Number,
      required: [true, 'Product must have a reorder point'],
      min: [0, 'Reorder point cannot be negative'],
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'discontinued', 'out_of_stock'],
      default: 'active',
    },
    image: {
      type: String,
      default: 'default-product.jpg',
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
productSchema.index({ sku: 1 });
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ expiryDate: 1 });
productSchema.index({ currentStock: 1 });

// Virtual populate for sales history
productSchema.virtual('sales', {
  ref: 'Sale',
  foreignField: 'product',
  localField: '_id',
});

// Instance method to check if stock is low
productSchema.methods.isLowStock = function() {
  return this.currentStock <= this.reorderPoint;
};

// Instance method to check if product is expired
productSchema.methods.isExpired = function() {
  return this.expiryDate <= new Date();
};

// Instance method to check if product is near expiry
productSchema.methods.isNearExpiry = function() {
  const daysUntilExpiry = Math.ceil(
    (this.expiryDate - new Date()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= 30; // Consider near expiry if within 30 days
};

// Static method to find low stock products
productSchema.statics.findLowStock = function() {
  return this.find({
    currentStock: { $lte: this.minimumStock },
    status: 'active',
  });
};

// Static method to find expiring products
productSchema.statics.findExpiring = function() {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return this.find({
    expiryDate: { $lte: thirtyDaysFromNow },
    status: 'active',
  });
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product; 