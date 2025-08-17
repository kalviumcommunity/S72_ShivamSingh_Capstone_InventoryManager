import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Save, Trash2 } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { useInventory } from '../../hooks/useInventory';
import { useAuth } from '../../hooks/useAuth';
import { InventoryProvider } from '../../context/InventoryContext';
import { InventoryItem } from '../../types/inventory';

const EditInventoryItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItemById, updateItem, deleteItem } = useInventory();
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    description: '',
    sku: '',
    category: '',
    quantity: 0,
    threshold: 0,
    price: 0,
    image: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const item = getItemById(id || '');
    if (item) {
      setFormData(item);
    } else {
      navigate('/inventory');
    }
  }, [id, getItemById, navigate]);

  if (!isManager) {
    navigate('/inventory');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'threshold' || name === 'price'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await updateItem(id || '', formData as InventoryItem);
      navigate(`/inventory/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await deleteItem(id || '');
        navigate('/inventory');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete item');
        setIsLoading(false);
      }
    }
  };

  return (
    <Layout title="Edit Inventory Item">
      <div className="mb-6 flex items-center justify-between">
        <Link to={`/inventory/${id}`} className="btn btn-outline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Item</span>
        </Link>
        
        <button
          onClick={handleDelete}
          className="btn btn-error flex items-center gap-2"
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Item</span>
        </button>
      </div>

      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-error-50 border border-error-200 rounded-lg text-error-700">
              {error}
            </div>
          )}

          <div className="card">
            <div className="flex items-start gap-4">
              {formData.image ? (
                <img 
                  src={formData.image} 
                  alt={formData.name}
                  className="w-32 h-32 rounded-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 space-y-4">
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Item Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  required
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="input w-full"
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
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input w-full"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  required
                  min="0"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="input w-full"
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
                  required
                  min="0"
                  value={formData.threshold}
                  onChange={handleInputChange}
                  className="input w-full"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              to={`/inventory/${id}`}
              className="btn btn-outline"
              tabIndex={0}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              disabled={isLoading}
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </motion.div>
    </Layout>
  );
};

const EditInventoryItemPageWithProvider = () => (
  <InventoryProvider>
    <EditInventoryItemPage />
  </InventoryProvider>
);

export default EditInventoryItemPageWithProvider;