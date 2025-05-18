const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getExpiringProducts,
  updateStock
} = require('../controllers/productController');

// Apply authentication middleware to all routes
router.use(protect);

// Routes accessible by all authenticated users
router
  .route('/')
  .get(getAllProducts)
  .post(restrictTo('admin', 'store-manager'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .patch(restrictTo('admin', 'store-manager'), updateProduct)
  .delete(restrictTo('admin'), deleteProduct);

// Stock management routes (store manager only)
router
  .route('/:id/stock')
  .patch(restrictTo('admin', 'store-manager'), updateStock);

// Analytics routes (store manager only)
router.get('/low-stock', restrictTo('admin', 'store-manager'), getLowStockProducts);
router.get('/expiring', restrictTo('admin', 'store-manager'), getExpiringProducts);

module.exports = router; 