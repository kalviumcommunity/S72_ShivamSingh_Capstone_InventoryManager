import api from './api';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image?: string;
}

export interface CreateInventoryItem {
  name: string;
  category: string;
  quantity: number;
  price: number;
  image?: string;
}

const inventoryService = {
  // Get all inventory items for the current user
  async getItems(): Promise<InventoryItem[]> {
    const response = await api.get('/inventory/items');
    return response.data;
  },

  // Create a new inventory item
  async createItem(item: CreateInventoryItem | FormData): Promise<InventoryItem> {
    const response = await api.post('/inventory/items', item, {
      headers: {
        'Content-Type': item instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    });
    return response.data;
  },

  // Update an existing inventory item
  async updateItem(id: string, item: Partial<CreateInventoryItem> | FormData): Promise<InventoryItem> {
    const response = await api.patch(`/inventory/items/${id}`, item, {
      headers: {
        'Content-Type': item instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    });
    return response.data;
  },

  // Delete an inventory item
  async deleteItem(id: string): Promise<void> {
    await api.delete(`/inventory/items/${id}`);
  }
};

export default inventoryService; 