const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { createNotification } = require('./notificationController');
const schedule = require('node-schedule');

// Get all products with filtering and pagination
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().populate('createdBy', 'name email');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

// Get single product
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('createdBy', 'name email');

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

// Create new product
exports.createProduct = catchAsync(async (req, res, next) => {
  // Add user ID to the request body
  req.body.createdBy = req.user.id;

  const product = await Product.create(req.body);

  // Create notification for low stock if applicable
  if (product.isLowStock()) {
    await createNotification(
      'Low Stock',
      `New product ${product.name} is low in stock`,
      [req.user.id],
      { type: 'Product', id: product._id }
    );
  }

  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

// Update product
exports.updateProduct = catchAsync(async (req, res, next) => {
  // Add user ID to the request body
  req.body.updatedBy = req.user.id;

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Create notification for low stock if applicable
  if (product.isLowStock()) {
    await createNotification(
      'Low Stock',
      `Product ${product.name} is low in stock`,
      [req.user.id],
      { type: 'Product', id: product._id }
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

// Delete product
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Get AI-powered price suggestions
exports.getPriceSuggestions = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update AI metrics
    await product.updateAIMetrics();

    // Get suggested price
    const suggestedPrice = product.suggestOptimalPrice();

    res.status(200).json({
      success: true,
      data: {
        currentPrice: product.price,
        suggestedPrice,
        aiMetrics: product.aiMetrics
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get products near expiry
exports.getExpiringProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findExpiring();

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

// Get low stock products
exports.getLowStockProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findLowStock();

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

// Schedule daily expiry checks
exports.scheduleExpiryChecks = () => {
  // Run at midnight every day
  schedule.scheduleJob('0 0 * * *', async () => {
    try {
      const products = await Product.find({
        isPerishable: true,
        expiryDate: {
          $gte: new Date(),
          $lte: new Date(Date.now() + parseInt(process.env.EXPIRY_NOTIFICATION_DAYS) * 24 * 60 * 60 * 1000)
        }
      });

      for (const product of products) {
        await createNotification(
          'Expiry Warning',
          'Product Expiring Soon',
          `Product "${product.name}" will expire on ${product.expiryDate.toLocaleDateString()}.`,
          [product.createdBy]
        );
      }
    } catch (error) {
      console.error('Error in expiry check schedule:', error);
    }
  });
};

exports.updateStock = catchAsync(async (req, res, next) => {
  const { quantity, type } = req.body; // type can be 'add' or 'remove'
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Update stock based on type
  if (type === 'add') {
    product.currentStock += quantity;
  } else if (type === 'remove') {
    if (product.currentStock < quantity) {
      return next(new AppError('Insufficient stock', 400));
    }
    product.currentStock -= quantity;
  } else {
    return next(new AppError('Invalid operation type', 400));
  }

  // Update last restocked date if adding stock
  if (type === 'add') {
    product.lastRestocked = new Date();
  }

  await product.save();

  // Create notification for low stock if applicable
  if (product.isLowStock()) {
    await createNotification(
      'Low Stock',
      `Product ${product.name} is low in stock`,
      [req.user.id],
      { type: 'Product', id: product._id }
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
}); 