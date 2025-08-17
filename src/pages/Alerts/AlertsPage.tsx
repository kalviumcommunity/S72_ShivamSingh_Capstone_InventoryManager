import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Settings, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { useInventory } from '../../hooks/useInventory';
import CustomButton from '../../components/common/CustomButton';

const AlertsPage = () => {
  const { getLowStockItems, loading } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  const lowStockItems = getLowStockItems();
  
  const filteredAlerts = lowStockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Layout title="Alerts">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Alerts">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search alerts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <CustomButton onClick={() => setShowSettings(!showSettings)}>
            <Settings />
            Alert Settings
          </CustomButton>
        </div>
      </div>

      {filteredAlerts.length > 0 ? (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {filteredAlerts.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-error-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-error-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Current stock: {item.quantity} | Threshold: {item.threshold}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success-100 mb-4">
            <CheckCircle className="h-8 w-8 text-success-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
          <p className="text-gray-500">
            All inventory items are above their threshold levels.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default AlertsPage;