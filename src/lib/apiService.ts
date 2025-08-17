const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}, retries = 3): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          if (response.status === 429 && attempt < retries) {
            // Rate limited, wait and retry
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          
          const errorData = await response.json().catch(() => ({ error: 'Network error' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        // Handle empty responses (like DELETE operations)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          // For non-JSON responses (like empty DELETE responses), return undefined
          return undefined as T;
        }
      } catch (error) {
        console.error(`API request failed (attempt ${attempt}/${retries}):`, error);
        
        if (attempt === retries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    throw new Error('All retry attempts failed');
  }

  // Categories API
  async getCategories() {
    return this.request<any[]>('/categories');
  }

  async getCategory(id: string) {
    return this.request<any>(`/categories/${id}`);
  }

  async createCategory(data: { name: string; description?: string }) {
    return this.request<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: { name?: string; description?: string }) {
    return this.request<any>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string) {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Inventory API
  async getInventory() {
    return this.request<any[]>('/inventory');
  }

  async getInventoryItem(id: string) {
    return this.request<any>(`/inventory/${id}`);
  }

  async createInventoryItem(data: {
    name: string;
    description?: string;
    sku: string;
    category_id?: string;
    quantity: number;
    price: number;
    threshold: number;
    image_url?: string;
    created_by: string;
  }) {
    return this.request<any>('/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInventoryItem(id: string, data: {
    name?: string;
    description?: string;
    sku?: string;
    category_id?: string;
    quantity?: number;
    price?: number;
    threshold?: number;
    image_url?: string;
  }) {
    return this.request<any>(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInventoryItem(id: string) {
    return this.request<void>(`/inventory/${id}`, {
      method: 'DELETE',
    });
  }

  async getLowStockItems() {
    return this.request<any[]>('/inventory/low-stock');
  }

  async searchInventory(query: string) {
    return this.request<any[]>(`/inventory/search?q=${encodeURIComponent(query)}`);
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; message: string }>('/health');
  }
}

export const apiService = new ApiService(); 