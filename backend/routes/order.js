const express = require('express');
const {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByStatus,
  getOrdersByDateRange,
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Routes accessible by all authenticated users
router.get('/', getAllOrders);
router.get('/:id', getOrder);

// Routes restricted to admin and store-manager
router.use(restrictTo('admin', 'store-manager'));

router.post('/', createOrder);
router.patch('/:id', updateOrder);
router.delete('/:id', restrictTo('admin'), deleteOrder);

// Analytics routes
router.get('/status/:status', getOrdersByStatus);
router.get('/date-range', getOrdersByDateRange);

module.exports = router; 