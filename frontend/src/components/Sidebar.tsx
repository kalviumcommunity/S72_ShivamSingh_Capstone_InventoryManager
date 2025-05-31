import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    authService.logout();
    localStorage.removeItem('guestUser');
    navigate('/login');
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { 
        name: 'Dashboard',
        href: '/dashboard',
        icon: '📊',
        description: 'Overview'
      },
      { 
        name: 'Inventory',
        href: '/inventory',
        icon: '📦',
        description: 'Stock Management'
      },
      { 
        name: 'Orders',
        href: '/orders',
        icon: '📝',
        description: 'New + Completed'
      },
      { 
        name: 'Notifications',
        href: '/notifications',
        icon: '🔔',
        description: 'Alerts & Logs'
      },
      { 
        name: 'AI Insights',
        href: '/ai-insights',
        icon: '🤖',
        description: 'Predictions & Reports'
      },
    ];

    // Show Settings for admin role
    if (user?.role === 'admin') {
      baseItems.push({ 
        name: 'Settings',
        href: '/settings',
        icon: '⚙️',
        description: 'User & System'
      });
    }

    return baseItems;
  };

  const navigation = getNavigationItems();

  return (
    <aside
      className="bg-white/5 backdrop-blur-xl border-r border-white/10 min-h-screen flex flex-col relative"
    >
      {/* Collapse Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 z-50"
      >
        {isCollapsed ? '→' : '←'}
      </motion.button>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1"
                  >
                    <span>{item.name}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;