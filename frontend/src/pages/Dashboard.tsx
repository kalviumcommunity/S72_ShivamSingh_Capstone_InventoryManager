import React from 'react';
import GraphicalGrid from '../components/GraphicalGrid';
import { motion } from 'framer-motion';

const dashboardItems = [
  {
    title: 'Total Revenue',
    description: '$45,231.89 (+20.1%)',
    icon: '💰',
    color: 'green',
  },
  {
    title: 'Total Items',
    description: '2,345 items in stock',
    icon: '📦',
    color: 'blue',
  },
  {
    title: 'Low Stock Alert',
    description: '12 items need attention',
    icon: '⚠️',
    color: 'orange',
  },
  {
    title: 'Monthly Growth',
    description: '+15.2% from last month',
    icon: '📈',
    color: 'purple',
  },
];

const recentActivity = [
  {
    title: 'New Inventory Added',
    description: 'John added Product XYZ',
    icon: '➕',
    color: 'green',
  },
  {
    title: 'Stock Updated',
    description: 'Jane updated Product ABC',
    icon: '📝',
    color: 'blue',
  },
  {
    title: 'New Order',
    description: 'Mike created Order #12345',
    icon: '🛒',
    color: 'purple',
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2 font-['Inter']">
          Welcome Back! 👋
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your inventory today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GraphicalGrid items={dashboardItems} />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6 font-['Inter']">
          Recent Activity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{activity.icon}</span>
                <div>
                  <h3 className="text-white font-medium">{activity.title}</h3>
                  <p className="text-sm text-gray-400">{activity.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6 font-['Inter']">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Add Item', 'New Order', 'Generate Report', 'View Analytics'].map((action, index) => (
            <motion.button
              key={action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500/20 to-orange-500/20 rounded-xl p-4 text-white border border-white/10 hover:from-orange-500/30 hover:to-orange-500/30 transition-all duration-300"
            >
              {action}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 