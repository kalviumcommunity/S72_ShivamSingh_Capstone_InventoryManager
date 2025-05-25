import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../services/authService';

const Navbar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'store_manager':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'inventory_manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Inventory Manager
            </Link>
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="text-orange-400">/</span>
              <span className="text-white">{getPageTitle()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Role Badge */}
            {user?.role && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                {user.role.replace('_', ' ')}
              </span>
            )}

            <div className="relative group">
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-64 bg-white/5 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-white/10 transition-all duration-300"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 group-hover:text-orange-400 transition-colors">🔍</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-400 hover:text-white relative transition-colors duration-200"
              >
                <span className="text-xl">🔔</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                >
                  3
                </motion.span>
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white/5 backdrop-blur-xl rounded-lg shadow-lg py-2 z-50 border border-white/10"
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <h3 className="text-sm font-medium text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <motion.div
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        className="px-4 py-3 cursor-pointer"
                      >
                        <p className="text-sm text-white">Low stock alert: Product XYZ</p>
                        <p className="text-xs text-gray-400">2 minutes ago</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        className="px-4 py-3 cursor-pointer"
                      >
                        <p className="text-sm text-white">New order received: #12345</p>
                        <p className="text-xs text-gray-400">1 hour ago</p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-500 flex items-center justify-center overflow-hidden">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'http://localhost:5000/uploads/profiles/default.jpg';
                      }}
                    />
                  ) : (
                    <span className="text-white">
                      {user?.name ? user.name[0].toUpperCase() : '👤'}
                    </span>
                  )}
                </div>
              </button>
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white/5 backdrop-blur-xl rounded-lg shadow-lg py-2 z-50 border border-white/10"
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-medium text-white">{user?.name || 'Guest User'}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                      {user?.role && (
                        <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/profile/edit');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => {
                          authService.logout();
                          navigate('/login');
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;