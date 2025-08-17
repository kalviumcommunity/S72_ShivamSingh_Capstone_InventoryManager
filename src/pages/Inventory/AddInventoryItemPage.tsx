import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Plus } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { useInventory } from '../../hooks/useInventory';
import { useActivity } from '../../hooks/useActivity';
import { InventoryProvider } from '../../context/InventoryContext';
import type { InventoryItem } from '../../types/inventory';

const AddInventoryItemPage = () => {
  const navigate = useNavigate();
  const { addItem } = useInventory();
  const { logActivity } = useActivity();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    quantity: '',
    threshold: '',
    price: '',
    image: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: Partial<InventoryItem> = {
      ...formData,
      quantity: parseInt(formData.quantity),
      threshold: parseInt(formData.threshold),
      price: parseFloat(formData.price),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      const addedItem = await addItem(newItem);
      await logActivity({
        type: 'item_created',
        description: `Added new inventory item: ${formData.name}`,
        itemId: addedItem.id
      });
      navigate(`/inventory/${addedItem.id}`);
    } catch (error) {
      console.error('Failed to add inventory item:', error);
      // Handle error appropriately
    }
  };

  return (
    <Layout title="Add New Item">
      <div className="mb-6">
        <Link to="/inventory" className="btn btn-outline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Inventory</span>
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input w-full"
                  placeholder="Enter item name"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="input w-full"
                  placeholder="Enter item description"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    className="input w-full"
                    placeholder="Enter SKU"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="input w-full"
                    placeholder="Enter category"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="input w-full"
                  placeholder="Enter quantity"
                />
              </div>
              
              <div>
                <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Threshold
                </label>
                <input
                  type="number"
                  id="threshold"
                  name="threshold"
                  value={formData.threshold}
                  onChange={handleChange}
                  required
                  min="0"
                  className="input w-full"
                  placeholder="Enter threshold"
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="input w-full"
                  placeholder="Enter price"
                />
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Image</h2>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input w-full"
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="mt-4">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Item preview"
                  className="w-32 h-32 rounded-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
          </div>
        </form>
      </motion.div>
    </Layout>
  );
};

const AddInventoryItemPageWithProvider = () => (
  <InventoryProvider>
    <AddInventoryItemPage />
  </InventoryProvider>
);

export default AddInventoryItemPageWithProvider;