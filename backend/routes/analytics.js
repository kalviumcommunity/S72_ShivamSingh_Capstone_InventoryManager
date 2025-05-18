const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getSalesAnalytics,
  getInventoryAnalytics,
  getReorderingRecommendations
} = require('../controllers/analyticsController');

// Apply authentication to all routes
router.use(protect);

// Analytics routes (Store Manager only)
router.use(restrictTo('Store Manager'));
router.get('/sales', getSalesAnalytics);
router.get('/inventory', getInventoryAnalytics);
router.get('/reorder-recommendations', getReorderingRecommendations);

module.exports = router; 