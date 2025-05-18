const express = require('express');
const router = express.Router();
const { protect, restrictTo, checkResourceAccess } = require('../middleware/auth');
const Product = require('../models/Product');
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getPriceSuggestions,
  getExpiringProducts,
  getLowStockProducts
} = require('../controllers/productController');

// Apply authentication to all routes
router.use(protect);

// Public product routes (authenticated)
router.get('/', getAllProducts);
router.get('/expiring', getExpiringProducts);
router.get('/low-stock', getLowStockProducts);
router.get('/:id', getProduct);

// Protected routes (Store Manager only)
router.use(restrictTo('Store Manager'));
router.post('/', createProduct);
router.patch('/:id', checkResourceAccess(Product), updateProduct);
router.delete('/:id', checkResourceAccess(Product), deleteProduct);
router.get('/:id/price-suggestions', getPriceSuggestions);

module.exports = router; 