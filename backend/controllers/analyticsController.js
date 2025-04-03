const Product = require('../models/Product');
const Order = require('../models/Order');
const { createNotification } = require('../middleware/auth');

// Get sales analytics
exports.getSalesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
    const end = endDate ? new Date(endDate) : new Date();

    // Get orders within date range
    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      orderStatus: 'Delivered'
    });

    // Calculate sales metrics
    const salesData = calculateSalesMetrics(orders, groupBy);
    const topProducts = await getTopProducts(orders);
    const customerSegments = analyzeCustomerSegments(orders);

    res.status(200).json({
      success: true,
      data: {
        salesData,
        topProducts,
        customerSegments
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get inventory analytics
exports.getInventoryAnalytics = async (req, res) => {
  try {
    const products = await Product.find();
    
    const inventoryMetrics = {
      totalProducts: products.length,
      totalValue: products.reduce((sum, product) => sum + (product.price * product.currentStock), 0),
      lowStock: products.filter(product => product.currentStock <= product.minimumStock).length,
      outOfStock: products.filter(product => product.currentStock === 0).length,
      expiringSoon: products.filter(product => product.isNearExpiry).length
    };

    const stockDistribution = analyzeStockDistribution(products);
    const categoryDistribution = analyzeCategoryDistribution(products);

    res.status(200).json({
      success: true,
      data: {
        inventoryMetrics,
        stockDistribution,
        categoryDistribution
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get reordering recommendations
exports.getReorderingRecommendations = async (req, res) => {
  try {
    const products = await Product.find();
    const recommendations = [];

    for (const product of products) {
      // Calculate reorder point
      const reorderPoint = calculateReorderPoint(product);
      
      // Check if product needs reordering
      if (product.currentStock <= reorderPoint) {
        // Calculate recommended order quantity
        const recommendedQuantity = calculateRecommendedOrderQuantity(product);
        
        recommendations.push({
          product: {
            id: product._id,
            name: product.name,
            sku: product.sku,
            currentStock: product.currentStock,
            minimumStock: product.minimumStock,
            reorderPoint
          },
          recommendedQuantity,
          urgency: determineUrgency(product, reorderPoint),
          reason: generateRecommendationReason(product, reorderPoint)
        });
      }
    }

    // Sort recommendations by urgency
    recommendations.sort((a, b) => b.urgency - a.urgency);

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Helper functions
const calculateSalesMetrics = (orders, groupBy) => {
  const metrics = {
    totalSales: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    averageOrderValue: orders.length > 0 
      ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length 
      : 0
  };

  // Group sales by time period
  const groupedSales = {};
  orders.forEach(order => {
    const date = new Date(order.createdAt);
    let key;
    
    switch (groupBy) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!groupedSales[key]) {
      groupedSales[key] = {
        date: key,
        sales: 0,
        orders: 0
      };
    }

    groupedSales[key].sales += order.total;
    groupedSales[key].orders += 1;
  });

  metrics.groupedSales = Object.values(groupedSales);

  return metrics;
};

const getTopProducts = async (orders) => {
  const productSales = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.product]) {
        productSales[item.product] = {
          quantity: 0,
          revenue: 0
        };
      }
      productSales[item.product].quantity += item.quantity;
      productSales[item.product].revenue += item.subtotal;
    });
  });

  const topProducts = await Promise.all(
    Object.entries(productSales)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, 10)
      .map(async ([productId, sales]) => {
        const product = await Product.findById(productId);
        return {
          product: {
            id: product._id,
            name: product.name,
            sku: product.sku
          },
          ...sales
        };
      })
  );

  return topProducts;
};

const analyzeCustomerSegments = (orders) => {
  const segments = {
    highValue: [],
    regular: [],
    occasional: []
  };

  const customerOrders = {};
  orders.forEach(order => {
    const customerId = order.customer.email;
    if (!customerOrders[customerId]) {
      customerOrders[customerId] = {
        totalSpent: 0,
        orderCount: 0
      };
    }
    customerOrders[customerId].totalSpent += order.total;
    customerOrders[customerId].orderCount += 1;
  });

  Object.entries(customerOrders).forEach(([customerId, data]) => {
    if (data.totalSpent > 1000) {
      segments.highValue.push({ customerId, ...data });
    } else if (data.orderCount > 3) {
      segments.regular.push({ customerId, ...data });
    } else {
      segments.occasional.push({ customerId, ...data });
    }
  });

  return segments;
};

const analyzeStockDistribution = (products) => {
  return {
    overstocked: products.filter(p => p.currentStock > p.maximumStock * 0.8).length,
    optimal: products.filter(p => 
      p.currentStock > p.minimumStock && 
      p.currentStock <= p.maximumStock * 0.8
    ).length,
    lowStock: products.filter(p => 
      p.currentStock > p.minimumStock && 
      p.currentStock <= p.minimumStock * 1.5
    ).length,
    critical: products.filter(p => p.currentStock <= p.minimumStock).length
  };
};

const analyzeCategoryDistribution = (products) => {
  const categories = {};
  products.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = 0;
    }
    categories[product.category]++;
  });

  return Object.entries(categories).map(([category, count]) => ({
    category,
    count,
    percentage: (count / products.length) * 100
  }));
};

const calculateReorderPoint = (product) => {
  // Calculate average daily demand
  const recentOrders = product.salesHistory.filter(
    sale => sale.date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const totalDemand = recentOrders.reduce((sum, sale) => sum + sale.quantity, 0);
  const averageDailyDemand = totalDemand / 30;

  // Calculate lead time (assuming 7 days)
  const leadTime = 7;

  // Calculate safety stock (2 weeks of average demand)
  const safetyStock = averageDailyDemand * 14;

  // Calculate reorder point
  return Math.ceil((averageDailyDemand * leadTime) + safetyStock);
};

const calculateRecommendedOrderQuantity = (product) => {
  const reorderPoint = calculateReorderPoint(product);
  const currentStock = product.currentStock;
  const maximumStock = product.maximumStock;

  // Calculate economic order quantity (EOQ)
  const annualDemand = product.salesHistory.reduce((sum, sale) => sum + sale.quantity, 0);
  const orderingCost = 50; // Assuming fixed ordering cost
  const holdingCost = product.price * 0.2; // 20% of product price
  const eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);

  // Calculate recommended quantity
  const recommendedQuantity = Math.min(
    Math.ceil(eoq),
    maximumStock - currentStock
  );

  return Math.max(recommendedQuantity, 1);
};

const determineUrgency = (product, reorderPoint) => {
  const stockRatio = product.currentStock / reorderPoint;
  
  if (stockRatio <= 0.5) return 3; // High urgency
  if (stockRatio <= 0.75) return 2; // Medium urgency
  return 1; // Low urgency
};

const generateRecommendationReason = (product, reorderPoint) => {
  const stockRatio = product.currentStock / reorderPoint;
  
  if (stockRatio <= 0.5) {
    return 'Critical stock level - Immediate action required';
  } else if (stockRatio <= 0.75) {
    return 'Stock level approaching reorder point';
  } else {
    return 'Regular reorder recommendation';
  }
}; 