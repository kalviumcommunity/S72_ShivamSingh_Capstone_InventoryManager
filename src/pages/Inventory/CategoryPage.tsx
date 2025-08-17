import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown,
  ArrowLeft,
  Edit,
  Package,
  Plus,
  Minus
} from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { useInventory } from '../../hooks/useInventory';
import { InventoryProvider } from '../../context/InventoryContext';
import CustomButton from '../../components/common/CustomButton';
import styled from 'styled-components';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { items, categories, updateItem, deleteItem } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'quantity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const category = categories.find(c => c.id === categoryId);
  const categoryItems = useMemo(() => {
    return items
      .filter(item => item.categoryId === categoryId)
      .filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        return sortOrder === 'asc' 
          ? (aValue > bValue ? 1 : -1)
          : (aValue < bValue ? 1 : -1);
      });
  }, [items, categoryId, searchQuery, sortBy, sortOrder]);

  const totalPages = Math.ceil(categoryItems.length / itemsPerPage);
  const currentItems = categoryItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: 'name' | 'price' | 'quantity') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleIncrementQuantity = async (itemId: string, currentQuantity: number) => {
    try {
      await updateItem(itemId, { quantity: currentQuantity + 1 });
    } catch (error) {
      console.error('Failed to increment quantity:', error);
    }
  };

  const handleDecrementQuantity = async (itemId: string, currentQuantity: number) => {
    if (currentQuantity <= 0) return;
    try {
      await updateItem(itemId, { quantity: currentQuantity - 1 });
    } catch (error) {
      console.error('Failed to decrement quantity:', error);
    }
  };

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        await deleteItem(itemId);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  if (!category) {
    return (
      <Layout title="Category Not Found">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
          <Link to="/inventory" className="text-primary-600 hover:text-primary-700">
            Return to Inventory
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={category.name}>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/inventory" className="hover:text-primary-600">Inventory</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{category.name}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 flex items-center gap-4">
            <Link to="/inventory">
              <CustomButton>
                <ArrowLeft />
                Back to Categories
              </CustomButton>
            </Link>
            
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSort('name')}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Name
              <ArrowUpDown className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleSort('price')}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Price
              <ArrowUpDown className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleSort('quantity')}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Stock
              <ArrowUpDown className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <SlidersHorizontal className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {currentItems.length > 0 ? (
        <>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {currentItems.map((item) => (
              <StyledCard key={item.id}>
                <div className="card-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="placeholder">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="card-content">
                  <h3>{item.name}</h3>
                  <p className="description">{item.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="price">${item.price.toFixed(2)}</span>
                    <span className={`stock ${item.quantity <= item.threshold ? 'low' : ''}`}>
                      {item.quantity} in stock
                    </span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link to={`/inventory/${item.id}`} className="view-btn">
                    View Details
                  </Link>
                  <div className="flex items-center gap-2">
                    <button 
                      className="action-btn"
                      onClick={() => handleDecrementQuantity(item.id, item.quantity)}
                      disabled={item.quantity <= 0}
                      title="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium text-gray-700 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button 
                      className="action-btn"
                      onClick={() => handleIncrementQuantity(item.id, item.quantity)}
                      title="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <Link to={`/inventory/${item.id}/edit`} className="action-btn" title="Edit item">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button 
                      className="action-btn text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      title="Delete item"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </StyledCard>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500">
            {searchQuery 
              ? 'No items match your search criteria.' 
              : 'This category is empty.'}
          </p>
        </div>
      )}
    </Layout>
  );
};

const StyledCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .card-image {
    height: 200px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
    }
  }

  .card-content {
    padding: 1rem;

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .description {
      font-size: 0.875rem;
      color: #6b7280;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .price {
      font-weight: 600;
      color: #059669;
    }

    .stock {
      font-size: 0.875rem;
      color: #6b7280;

      &.low {
        color: #dc2626;
      }
    }
  }

  .card-actions {
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .view-btn {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background-color 0.2s ease;

      &:hover {
        background: #2563eb;
      }
    }

    .action-btn {
      padding: 0.5rem;
      border-radius: 6px;
      color: #6b7280;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: #f3f4f6;
        color: #1f2937;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
`;

const CategoryPageWithProvider = () => (
  <InventoryProvider>
    <CategoryPage />
  </InventoryProvider>
);

export default CategoryPageWithProvider;