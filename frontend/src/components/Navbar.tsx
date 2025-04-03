import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-[#0f1117] border-b border-gray-700">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-white">
              Inventory Manager
            </Link>
            {/* Breadcrumb - can be made dynamic based on current route */}
            <div className="ml-4 text-gray-400">
              <span>/</span>
              <span className="ml-2">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-64 bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-400 hover:text-white relative"
              >
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <h3 className="text-sm font-medium text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {/* Sample notifications */}
                    <div className="px-4 py-3 hover:bg-gray-700 cursor-pointer">
                      <p className="text-sm text-white">Low stock alert: Product XYZ</p>
                      <p className="text-xs text-gray-400">2 minutes ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-700 cursor-pointer">
                      <p className="text-sm text-white">New order received: #12345</p>
                      <p className="text-xs text-gray-400">1 hour ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 