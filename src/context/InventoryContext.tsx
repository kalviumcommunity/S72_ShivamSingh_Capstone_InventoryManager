import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { InventoryItem, Category } from '../types/inventory';
import { useAuth } from '../hooks/useAuth';
import { ActivityLogType } from '../types/activity';
import { apiService } from '../lib/apiService';

interface InventoryContextType {
  items: InventoryItem[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<InventoryItem>;
  updateItem: (id: string, updatedItem: Partial<InventoryItem>) => Promise<InventoryItem>;
  deleteItem: (id: string) => Promise<void>;
  getItemById: (id: string) => InventoryItem | undefined;
  getLowStockItems: () => InventoryItem[];
  addCategory: (category: { name: string; description?: string }) => Promise<Category>;
  updateCategory: (id: string, category: { name?: string; description?: string }) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  searchItems: (query: string) => Promise<InventoryItem[]>;
  refreshData: () => Promise<void>;
}

export const InventoryContext = createContext<InventoryContextType>({
  items: [],
  categories: [],
  loading: false,
  error: null,
  addItem: async () => ({ id: '', name: '', description: '', sku: '', category: '', quantity: 0, price: 0, threshold: 0, createdAt: '', updatedAt: '' }),
  updateItem: async () => ({ id: '', name: '', description: '', sku: '', category: '', quantity: 0, price: 0, threshold: 0, createdAt: '', updatedAt: '' }),
  deleteItem: async () => {},
  getItemById: () => undefined,
  getLowStockItems: () => [],
  addCategory: async () => ({ id: '', name: '', description: '', createdAt: '', updatedAt: '' }),
  updateCategory: async () => ({ id: '', name: '', description: '', createdAt: '', updatedAt: '' }),
  deleteCategory: async () => {},
  searchItems: async () => [],
  refreshData: async () => {},
});

// Helper to add activity log and notify ActivityContext
const addActivityLog = (activityLog: ActivityLogType) => {
  try {
    const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    logs.push(activityLog);
    localStorage.setItem('activityLogs', JSON.stringify(logs));
    
    // Dispatch custom event to notify ActivityContext
    window.dispatchEvent(new CustomEvent('activityLogAdded', { detail: activityLog }));
  } catch (err) {
    console.error('Failed to add activity log:', err);
  }
};

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const { user } = useAuth();
  
  // Load data from API
  const loadData = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isLoadingData) return;
    
    try {
      setIsLoadingData(true);
      setLoading(true);
      setError(null);
      
      // Try to load from API first
      try {
        const [itemsData, categoriesData] = await Promise.all([
          apiService.getInventory(),
          apiService.getCategories()
        ]);
        
        console.log('InventoryContext: Loaded items from API:', itemsData);
        console.log('InventoryContext: Loaded categories from API:', categoriesData);
        
        setItems(itemsData);
        setCategories(categoriesData);
      } catch (apiError) {
        console.log('InventoryContext: API failed, using mock data:', apiError);
        
        // Use mock data if API fails
        const mockCategories = [
          { id: '1', name: 'Electronics', description: 'Electronic devices', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', name: 'Clothing', description: 'Apparel items', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '3', name: 'Food & Beverages', description: 'Food products', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ];
        
        const mockItems = [
          {
            id: '1',
            name: 'Laptop',
            description: 'High-performance laptop',
            sku: 'LAP-001',
            category: 'Electronics',
            categoryId: '1',
            quantity: 3,
            price: 999.99,
            threshold: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            imageUrl: ''
          },
          {
            id: '2',
            name: 'T-Shirt',
            description: 'Cotton t-shirt',
            sku: 'TSH-001',
            category: 'Clothing',
            categoryId: '2',
            quantity: 2,
            price: 19.99,
            threshold: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            imageUrl: ''
          },
          {
            id: '3',
            name: 'Coffee Beans',
            description: 'Premium coffee beans',
            sku: 'COF-001',
            category: 'Food & Beverages',
            categoryId: '3',
            quantity: 1,
            price: 15.99,
            threshold: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            imageUrl: ''
          }
        ];
        
        setItems(mockItems);
        setCategories(mockCategories);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load inventory data';
      setError(errorMessage);
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
      setIsLoadingData(false);
    }
  }, []);

  // Initialize inventory state
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Add new inventory item
  const addItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> => {
    if (!user) {
      throw new Error('User must be authenticated to add items');
    }

    setLoading(true);
    setError(null);
    
    try {
      const itemData = {
        name: item.name,
        description: item.description,
        sku: item.sku,
        category_id: item.categoryId || undefined,
        quantity: item.quantity,
        price: item.price,
        threshold: item.threshold,
        image_url: item.imageUrl,
        created_by: user.uid
      };

      // Try API first
      try {
        const newItem = await apiService.createInventoryItem(itemData);
        
        setItems(prevItems => [newItem, ...prevItems]);
        
        // Log the activity
        addActivityLog({
          id: Math.random().toString(36).substring(2, 9),
          userId: user.uid,
          userName: user.displayName || user.email || 'Unknown User',
          action: 'create',
          resourceType: 'inventory',
          resourceId: newItem.id,
          resourceName: newItem.name,
          timestamp: new Date().toISOString(),
          details: `Created new inventory item: ${newItem.name}`,
        });
        
        return newItem;
      } catch (apiError) {
        console.log('InventoryContext: API failed, adding to mock data:', apiError);
        
        // Add to mock data if API fails
        const newItem: InventoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          name: item.name,
          description: item.description,
          sku: item.sku,
          category: '',
          categoryId: item.categoryId,
          quantity: item.quantity,
          price: item.price,
          threshold: item.threshold,
          imageUrl: item.imageUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setItems(prevItems => [newItem, ...prevItems]);
        
        // Log the activity
        addActivityLog({
          id: Math.random().toString(36).substring(2, 9),
          userId: user.uid,
          userName: user.displayName || user.email || 'Unknown User',
          action: 'create',
          resourceType: 'inventory',
          resourceId: newItem.id,
          resourceName: newItem.name,
          timestamp: new Date().toISOString(),
          details: `Created new inventory item: ${newItem.name}`,
        });
        
        return newItem;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add inventory item';
      setError(errorMessage);
      console.error('Add item error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update existing inventory item
  const updateItem = async (id: string, updatedItem: Partial<InventoryItem>): Promise<InventoryItem> => {
    setLoading(true);
    setError(null);
    
    try {
      const itemData = {
        name: updatedItem.name,
        description: updatedItem.description,
        sku: updatedItem.sku,
        category_id: updatedItem.categoryId,
        quantity: updatedItem.quantity,
        price: updatedItem.price,
        threshold: updatedItem.threshold,
        image_url: updatedItem.imageUrl
      };

      const newItem = await apiService.updateInventoryItem(id, itemData);
      
      setItems(prevItems => 
        prevItems.map(item => item.id === id ? newItem : item)
      );
      
      // Log the activity
      if (user) {
        addActivityLog({
          id: Math.random().toString(36).substring(2, 9),
          userId: user.uid,
          userName: user.displayName || user.email || 'Unknown User',
          action: 'update',
          resourceType: 'inventory',
          resourceId: newItem.id,
          resourceName: newItem.name,
          timestamp: new Date().toISOString(),
          details: `Updated inventory item: ${newItem.name}`,
        });
      }
      
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update inventory item';
      setError(errorMessage);
      console.error('Update item error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete inventory item
  const deleteItem = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const itemToDelete = items.find(item => item.id === id);
      
      if (!itemToDelete) {
        throw new Error('Item not found');
      }
      
      await apiService.deleteInventoryItem(id);
      
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      // Log the activity
      if (user) {
        addActivityLog({
          id: Math.random().toString(36).substring(2, 9),
          userId: user.uid,
          userName: user.displayName || user.email || 'Unknown User',
          action: 'delete',
          resourceType: 'inventory',
          resourceId: id,
          resourceName: itemToDelete.name,
          timestamp: new Date().toISOString(),
          details: `Deleted inventory item: ${itemToDelete.name}`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete inventory item';
      setError(errorMessage);
      console.error('Delete item error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add new category
  const addCategory = async (category: { name: string; description?: string }): Promise<Category> => {
    setLoading(true);
    setError(null);
    
    try {
      const newCategory = await apiService.createCategory(category);
      
      setCategories(prevCategories => [...prevCategories, newCategory]);
      
      // Log the activity
      if (user) {
        addActivityLog({
          id: Math.random().toString(36).substring(2, 9),
          userId: user.uid,
          userName: user.displayName || user.email || 'Unknown User',
          action: 'create',
          resourceType: 'category',
          resourceId: newCategory.id,
          resourceName: newCategory.name,
          timestamp: new Date().toISOString(),
          details: `Created new category: ${newCategory.name}`,
        });
      }
      
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add category';
      setError(errorMessage);
      console.error('Add category error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const updateCategory = async (id: string, category: { name?: string; description?: string }): Promise<Category> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCategory = await apiService.updateCategory(id, category);
      
      setCategories(prevCategories => 
        prevCategories.map(cat => cat.id === id ? updatedCategory : cat)
      );
      
      // Log the activity
      if (user) {
        addActivityLog({
          id: Math.random().toString(36).substring(2, 9),
          userId: user.uid,
          userName: user.displayName || user.email || 'Unknown User',
          action: 'update',
          resourceType: 'category',
          resourceId: updatedCategory.id,
          resourceName: updatedCategory.name,
          timestamp: new Date().toISOString(),
          details: `Updated category: ${updatedCategory.name}`,
        });
      }
      
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      setError(errorMessage);
      console.error('Update category error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const categoryToDelete = categories.find(cat => cat.id === id);
      
      if (!categoryToDelete) {
        throw new Error('Category not found');
      }
      
      await apiService.deleteCategory(id);
      
      setCategories(prevCategories => prevCategories.filter(cat => cat.id !== id));
      
      // Log the activity
      if (user) {
        addActivityLog({
          id: Math.random().toString(36).substring(2, 9),
          userId: user.uid,
          userName: user.displayName || user.email || 'Unknown User',
          action: 'delete',
          resourceType: 'category',
          resourceId: id,
          resourceName: categoryToDelete.name,
          timestamp: new Date().toISOString(),
          details: `Deleted category: ${categoryToDelete.name}`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      setError(errorMessage);
      console.error('Delete category error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Search items
  const searchItems = async (query: string): Promise<InventoryItem[]> => {
    try {
      return await apiService.searchInventory(query);
    } catch (err) {
      console.error('Search items error:', err);
      throw new Error('Failed to search items');
    }
  };

  // Refresh data
  const refreshData = async (): Promise<void> => {
    await loadData();
  };

  // Helper functions
  const getItemById = (id: string): InventoryItem | undefined => {
    return items.find(item => item.id === id);
  };

  const getLowStockItems = (): InventoryItem[] => {
    return items.filter(item => item.quantity <= item.threshold);
  };

  const value = {
    items,
    categories,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    getLowStockItems,
    addCategory,
    updateCategory,
    deleteCategory,
    searchItems,
    refreshData,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};