import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    authService.logout();
    localStorage.removeItem('guestUser');
    navigate('/login');
  };

  const navigation = [
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
    { 
      name: 'Settings',
      href: '/settings',
      icon: (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-5 h-5"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
      description: 'User & System',
      hideOnCollapse: true
    },
  ];

  return (
    <aside 
      className={`bg-[#0f1117] border-r border-gray-700 min-h-screen flex flex-col transition-all duration-300 relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors z-50"
      >
        {isCollapsed ? '→' : '←'}
      </button>

      {/* User Profile Section */}
      <div className="py-3 px-4 border-b border-gray-700 relative">
        <div className="flex flex-col items-center">
          <div className="relative">
            {!isCollapsed && (
              <Link 
                to="/profile/edit" 
                className="absolute -left-2 -top-2 w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                title="Edit Profile"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4 text-white"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </Link>
            )}
            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-xl text-white">
                {user?.name ? user.name[0].toUpperCase() : '👤'}
              </span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="mt-2 text-center">
              <h3 className="text-sm font-medium text-white">
                {user?.name || user?.email || 'Guest User'}
              </h3>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-white mt-1"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4 overflow-y-auto">
        <div className="px-2 space-y-1">
          {navigation.map((item) => (
            (!isCollapsed || !item.hideOnCollapse) && (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                title={isCollapsed ? item.name : ''}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {!isCollapsed && (
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                )}
              </Link>
            )
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 