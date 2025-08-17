import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, Edit, AlertTriangle } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { useInventory } from '../../hooks/useInventory';
import { useAuth } from '../../hooks/useAuth';
import { InventoryProvider } from '../../context/InventoryContext';

const InventoryItemPage = () => {
  const { id } = useParams();
  const { getItemById } = useInventory();
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  
  const item = getItemById(id || '');
  
  if (!item) {
    return (
      <Layout title="Item Not Found">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-error-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-error-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-6">
            The inventory item you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/inventory" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={item.name}>
      <div className="mb-6 flex items-center justify-between">
        <Link to="/inventory" className="btn btn-outline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Inventory</span>
        </Link>
        
        {isManager && (
          <Link to={`/inventory/${id}/edit`} className="btn btn-primary flex items-center gap-2">
            <Edit className="h-4 w-4" />
            <span>Edit Item</span>
          </Link>
        )}
      </div>
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start gap-4">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-32 h-32 rounded-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h1>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">SKU</p>
                    <p className="font-medium">{item.sku}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{item.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Current Stock</p>
                <p className="text-2xl font-semibold">
                  {item.quantity}
                  <span className="text-sm font-normal text-gray-500 ml-1">units</span>
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Stock Threshold</p>
                <p className="text-2xl font-semibold">
                  {item.threshold}
                  <span className="text-sm font-normal text-gray-500 ml-1">units</span>
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Unit Price</p>
                <p className="text-2xl font-semibold">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
            
            {item.quantity <= item.threshold && (
              <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-error-500" />
                <div>
                  <p className="font-medium text-error-800">Low Stock Alert</p>
                  <p className="text-sm text-error-600">
                    Current stock is at or below the minimum threshold. Consider restocking soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Item Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-xl font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Stock Level</p>
                  <p className="text-sm font-medium text-gray-900">
                    {Math.round((item.quantity / item.threshold) * 100)}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.quantity <= item.threshold ? 'bg-error-500' :
                      item.quantity <= item.threshold * 2 ? 'bg-warning-500' :
                      'bg-success-500'
                    }`}
                    style={{ width: `${Math.min((item.quantity / item.threshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${
                item.quantity <= item.threshold ? 'bg-error-50 text-error-800' :
                item.quantity <= item.threshold * 2 ? 'bg-warning-50 text-warning-800' :
                'bg-success-50 text-success-800'
              }`}>
                {item.quantity <= item.threshold ? (
                  <p className="text-sm">Stock is critically low</p>
                ) : item.quantity <= item.threshold * 2 ? (
                  <p className="text-sm">Stock is running low</p>
                ) : (
                  <p className="text-sm">Stock level is healthy</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

const InventoryItemPageWithProvider = () => (
  <InventoryProvider>
    <InventoryItemPage />
  </InventoryProvider>
);

export default InventoryItemPageWithProvider;