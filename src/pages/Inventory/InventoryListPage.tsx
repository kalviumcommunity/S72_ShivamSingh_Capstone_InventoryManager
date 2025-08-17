import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Search, Filter, X, FolderPlus } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { useInventory } from '../../hooks/useInventory';
import { InventoryProvider } from '../../context/InventoryContext';
import CategoryCard from '../../components/inventory/CategoryCard';
import AddItemForm from '../../components/inventory/AddItemForm';
import AddCategoryModal from '../../components/inventory/AddCategoryModal';
import CustomButton from '../../components/common/CustomButton';
import styled from 'styled-components';

const InventoryListPage = () => {
  const { items, categories, addItem, addCategory, deleteItem, loading, error } = useInventory();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Group items by category
  const itemsByCategory = useMemo(() => {
    return items.reduce((acc, item) => {
      const category = categories.find(c => c.id === item.categoryId);
      if (category) {
        if (!acc[category.id]) {
          acc[category.id] = {
            name: category.name,
            items: []
          };
        }
        acc[category.id].items.push(item);
      }
      return acc;
    }, {} as Record<string, { name: string; items: typeof items }>);
  }, [items, categories]);



  const handleAddItem = async (formData: any) => {
    try {
      // Validate required fields
      if (!formData.name?.trim() || !formData.sku?.trim() || !formData.categoryId) {
        throw new Error('Please fill in all required fields including category');
      }

      await addItem({
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        categoryId: formData.categoryId,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        threshold: parseInt(formData.threshold),
        imageUrl: formData.imageUrl
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add item:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleAddCategory = async (categoryData: { name: string; description: string }) => {
    try {
      await addCategory(categoryData);
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  return (
    <Layout title="Inventory">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <CustomButton onClick={() => setShowAddCategory(true)} disabled={loading}>
            <FolderPlus />
            Add Category
          </CustomButton>
          <CustomButton onClick={() => setShowAddForm(true)} disabled={loading}>
            <Plus />
            Add Item
          </CustomButton>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <StyledModal>
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
            />
            <motion.div 
              className="modal-container"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <button onClick={() => setShowAddForm(false)} className="close-btn">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <AddItemForm 
                  onSubmit={handleAddItem}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            </motion.div>
          </StyledModal>
        )}
      </AnimatePresence>

      <AddCategoryModal
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSubmit={handleAddCategory}
        loading={loading}
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <Package className="h-8 w-8 text-gray-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading inventory...</h3>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Object.entries(itemsByCategory).map(([categoryId, category]) => (
              <CategoryCard
                key={categoryId}
                name={category.name}
                itemCount={category.items.length}
                categoryId={categoryId}
              />
            ))}
          </div>

          {Object.keys(itemsByCategory).length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500 mb-6">
                Start by adding your first inventory item or category.
              </p>
              <div className="flex gap-2 justify-center">
                <button 
                  onClick={() => setShowAddCategory(true)}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>Add Category</span>
                </button>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add First Item</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

const StyledModal = styled.div`
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 50;
  }

  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 51;
    padding: 1rem;
  }

  .modal-content {
    position: relative;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    background: white;
    border-radius: 25px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .modal-header {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 52;
  }

  .close-btn {
    padding: 0.5rem;
    border-radius: 0.5rem;
    color: #6b7280;
    transition: all 0.3s ease;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    &:hover {
      background: #f3f4f6;
      color: #1f2937;
    }
  }
`;

const InventoryListPageWithProvider = () => (
  <InventoryProvider>
    <InventoryListPage />
  </InventoryProvider>
);

export default InventoryListPageWithProvider;