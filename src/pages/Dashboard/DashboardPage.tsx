import { motion } from 'framer-motion';
import { 
  Package, 
  Users, 
  AlertTriangle, 
  Truck, 
  TrendingUp, 
  Clock, 
  Calendar,
  Activity,
  Star,
  ShoppingCart,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { useInventory } from '../../hooks/useInventory';
import { useActivity } from '../../hooks/useActivity';
import { InventoryProvider } from '../../context/InventoryContext';
import { ActivityProvider } from '../../context/ActivityContext';
import StatsCard from '../../components/common/StatsCard';

const DashboardPageContent = () => {
  const { items, getLowStockItems } = useInventory();
  const { getLogs } = useActivity();
  
  const lowStockItems = getLowStockItems();
  const totalItems = items.length;
  const totalCategories = [...new Set(items.map(item => item.category))].length;
  const totalValue = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const recentLogs = getLogs().slice(0, 5);

  // Mock data for additional widgets
  const topSellingItems = items.slice(0, 5);
  const itemsNearExpiry = items.filter(item => Math.random() > 0.8).slice(0, 3);
  const monthlyRevenue = 45230;
  const revenueGrowth = 12.5;

  const stats = [
    {
      number: totalItems.toString(),
      title: 'Total Items',
      icon: <Package className="h-6 w-6" />,
      type: 'totalItems',
    },
    {
      number: totalCategories.toString(),
      title: 'Categories',
      icon: <Truck className="h-6 w-6" />,
      type: 'categories',
    },
    {
      number: `$${totalValue.toFixed(0)}`,
      title: 'Total Value',
      icon: <DollarSign className="h-6 w-6" />,
      type: 'totalValue',
    },
    {
      number: lowStockItems.length.toString(),
      title: 'Low Stock',
      icon: <AlertTriangle className="h-6 w-6" />,
      type: 'lowStock',
    }
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Main Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="stats-card"
            >
              <StatsCard 
                number={stat.number}
                title={stat.title}
                icon={stat.icon}
                cardType={stat.type as 'totalItems' | 'categories' | 'totalValue' | 'lowStock'}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Secondary Widgets Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {/* Revenue Forecast */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-light-primary dark:text-dark-primary" />
                Revenue Forecast
              </h3>
              <span className={`text-sm px-2 py-1 rounded-full ${revenueGrowth > 0 ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'}`}>
                {revenueGrowth > 0 ? '+' : ''}{revenueGrowth}%
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-theme-secondary">This Month</span>
                <span className="text-2xl font-bold text-theme">${monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-light-secondary dark:bg-dark-secondary rounded-full h-2">
                <div className="bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-theme-secondary">Based on current sales trends</p>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="card">
            <h3 className="text-lg font-semibold text-theme mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-light-primary dark:text-dark-primary" />
              Top Selling Items
            </h3>
            <div className="space-y-3">
              {topSellingItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-light-primary dark:bg-dark-primary text-white text-xs flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-theme">{item.name}</span>
                  </div>
                  <span className="text-sm text-theme-secondary">{item.quantity} sold</span>
                </div>
              ))}
            </div>
          </div>

          {/* Items Near Expiry */}
          <div className="card">
            <h3 className="text-lg font-semibold text-theme mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-warning-500" />
              Items Near Expiry
            </h3>
            <div className="space-y-3">
              {itemsNearExpiry.length > 0 ? (
                itemsNearExpiry.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
                    <div>
                      <p className="text-sm font-medium text-theme">{item.name}</p>
                      <p className="text-xs text-warning-600 dark:text-warning-400">Expires in 5 days</p>
                    </div>
                    <span className="text-xs bg-warning-100 dark:bg-warning-900/40 text-warning-700 dark:text-warning-300 px-2 py-1 rounded-full">
                      {item.quantity} left
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-theme-secondary text-center py-4">No items expiring soon</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bottom Row - Recent Activity & Alerts */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-theme mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-light-primary dark:text-dark-primary" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      log.action === 'create' ? 'bg-success-500' :
                      log.action === 'update' ? 'bg-primary-500' :
                      log.action === 'delete' ? 'bg-error-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-theme">{log.details}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-theme-secondary">{log.userName}</span>
                        <span className="text-xs text-theme-secondary">•</span>
                        <span className="text-xs text-theme-secondary">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-theme-secondary text-center py-4">No recent activity</p>
              )}
            </div>
          </div>

          {/* Inventory Health */}
          <div className="card">
            <h3 className="text-lg font-semibold text-theme mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success-500" />
              Inventory Health
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-theme-secondary">Stock Levels</span>
                <span className="text-sm font-semibold text-success-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-theme-secondary">Turnover Rate</span>
                <span className="text-sm font-semibold text-theme">2.3x/month</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-theme-secondary">Reorder Alerts</span>
                <span className="text-sm font-semibold text-warning-600">{lowStockItems.length} items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-theme-secondary">Avg. Delivery Time</span>
                <span className="text-sm font-semibold text-theme">3.2 days</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

const DashboardPage = () => (
  <InventoryProvider>
    <ActivityProvider>
      <DashboardPageContent />
    </ActivityProvider>
  </InventoryProvider>
);

export default DashboardPage;