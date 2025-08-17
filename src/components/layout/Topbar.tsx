import { Bell, Menu, Search } from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TopbarProps {
  toggleSidebar: () => void;
  title: string;
}

export const Topbar = ({ toggleSidebar, title }: TopbarProps) => {
  const { getLowStockItems } = useInventory();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const lowStockItems = getLowStockItems();
  const hasNotifications = lowStockItems.length > 0;
  
  return (
    <header className="bg-white border-b border-gray-200 fixed left-0 right-0 z-20 h-16 md:h-20">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5 text-gray-500" />
          </button>
          
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
              placeholder="Search..." 
            />
          </div>
          
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5 text-gray-500" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  
                  {hasNotifications ? (
                    <div className="max-h-96 overflow-y-auto">
                      {lowStockItems.map((item) => (
                        <div 
                          key={item.id} 
                          className="p-3 border-b border-gray-100 hover:bg-gray-50"
                        >
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-error-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-error-600 text-xs font-medium">!</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">Low Stock Alert</p>
                              <p className="text-xs text-gray-600">
                                {item.name} is running low ({item.quantity} remaining)
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Threshold: {item.threshold}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No new notifications</p>
                    </div>
                  )}
                  
                  <div className="p-2 border-t border-gray-200">
                    <button className="w-full text-center text-xs text-primary-600 hover:text-primary-700 font-medium py-1">
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};