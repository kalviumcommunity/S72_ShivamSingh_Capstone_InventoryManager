const Order = require('../models/Order');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all orders
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate('items.product', 'name sku price')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

// Get single order
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name sku price')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// Create new order
exports.createOrder = catchAsync(async (req, res, next) => {
  // Add user ID to request body
  req.body.createdBy = req.user.id;

  // Check if all products exist and have sufficient stock
  for (const item of req.body.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new AppError(`Product with ID ${item.product} not found`, 404));
    }
    if (product.currentStock < item.quantity) {
      return next(
        new AppError(
          `Insufficient stock for product ${product.name}. Available: ${product.currentStock}`,
          400
        )
      );
    }
  }

  const order = await Order.create(req.body);

  // Update product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { currentStock: -item.quantity },
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// Update order
exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Add user ID to request body
  req.body.updatedBy = req.user.id;

  // If order status is being updated
  if (req.body.orderStatus && req.body.orderStatus !== order.orderStatus) {
    // If order is being cancelled, restore product stock
    if (req.body.orderStatus === 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { currentStock: item.quantity },
        });
      }
    }
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder,
    },
  });
});

// Delete order
exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Restore product stock if order is not cancelled
  if (order.orderStatus !== 'cancelled') {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { currentStock: item.quantity },
      });
    }
  }

  await Order.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Get orders by status
exports.getOrdersByStatus = catchAsync(async (req, res, next) => {
  const orders = await Order.findByStatus(req.params.status)
    .populate('items.product', 'name sku price')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

// Get orders by date range
exports.getOrdersByDateRange = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return next(
      new AppError('Please provide both startDate and endDate', 400)
    );
  }

  const orders = await Order.findByDateRange(
    new Date(startDate),
    new Date(endDate)
  )
    .populate('items.product', 'name sku price')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
}); 