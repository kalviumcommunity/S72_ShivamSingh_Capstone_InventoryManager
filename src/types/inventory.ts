export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  categoryId?: string;
  quantity: number;
  price: number;
  threshold: number;
  createdAt: string;
  updatedAt: string;
  image?: string;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}