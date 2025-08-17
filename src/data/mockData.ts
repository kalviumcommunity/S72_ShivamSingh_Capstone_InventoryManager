import { InventoryItem, Category } from '../types/inventory';
import { UserType } from '../types/user';

export const mockCategories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Electronic devices and accessories'
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Apparel and fashion items'
  },
  {
    id: 'food',
    name: 'Food & Beverages',
    description: 'Consumable goods and drinks'
  },
  {
    id: 'furniture',
    name: 'Furniture',
    description: 'Home and office furniture'
  },
  {
    id: 'office',
    name: 'Office Supplies',
    description: 'Stationery and office equipment'
  }
];

export const mockInventoryItems: InventoryItem[] = [
  {
    id: 'item-1',
    name: 'Laptop Pro X',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    sku: 'LP-X-001',
    category: 'electronics',
    quantity: 15,
    price: 1299.99,
    threshold: 5,
    createdAt: '2023-04-12T08:30:00Z',
    updatedAt: '2023-06-15T14:45:00Z',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'item-2',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling Bluetooth headphones with 20-hour battery life',
    sku: 'WH-002',
    category: 'electronics',
    quantity: 28,
    price: 199.99,
    threshold: 10,
    createdAt: '2023-03-20T10:15:00Z',
    updatedAt: '2023-05-18T11:30:00Z',
    image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'item-3',
    name: 'Premium T-Shirt',
    description: 'Soft cotton t-shirt in various colors and sizes',
    sku: 'TS-100',
    category: 'clothing',
    quantity: 75,
    price: 24.99,
    threshold: 20,
    createdAt: '2023-02-08T09:45:00Z',
    updatedAt: '2023-04-30T16:20:00Z',
    image: 'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'item-4',
    name: 'Ergonomic Office Chair',
    description: 'Adjustable chair with lumbar support and breathable mesh',
    sku: 'OC-ERG-1',
    category: 'furniture',
    quantity: 12,
    price: 249.99,
    threshold: 5,
    createdAt: '2023-01-15T13:10:00Z',
    updatedAt: '2023-03-25T09:40:00Z',
    image: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'item-5',
    name: 'Notebook Set',
    description: 'Set of 3 premium notebooks with dotted, lined, and blank pages',
    sku: 'NB-SET-3',
    category: 'office',
    quantity: 40,
    price: 19.99,
    threshold: 15,
    createdAt: '2023-05-02T11:20:00Z',
    updatedAt: '2023-06-10T15:35:00Z',
    image: 'https://images.pexels.com/photos/6410607/pexels-photo-6410607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'item-6',
    name: 'Organic Coffee Beans',
    description: 'Fair-trade organic coffee beans, medium roast, 1 lb bag',
    sku: 'OCB-1LB',
    category: 'food',
    quantity: 18,
    price: 14.99,
    threshold: 10,
    createdAt: '2023-04-22T08:55:00Z',
    updatedAt: '2023-06-05T10:15:00Z',
    image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'item-7',
    name: 'Smart Watch Series 5',
    description: 'Fitness and health tracking smartwatch with heart rate monitor',
    sku: 'SW-S5',
    category: 'electronics',
    quantity: 8,
    price: 299.99,
    threshold: 5,
    createdAt: '2023-03-10T14:30:00Z',
    updatedAt: '2023-05-12T09:25:00Z',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'item-8',
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and color temperature',
    sku: 'DL-LED-1',
    category: 'office',
    quantity: 25,
    price: 49.99,
    threshold: 8,
    createdAt: '2023-02-18T16:45:00Z',
    updatedAt: '2023-04-20T13:50:00Z',
    image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export const mockUsers: UserType[] = [
  {
    id: 'user-1',
    name: 'Store Manager',
    email: 'manager@example.com',
    role: 'manager',
    createdAt: '2023-01-01T00:00:00Z',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 'user-2',
    name: 'Staff Member',
    email: 'staff@example.com',
    role: 'staff',
    createdAt: '2023-01-15T00:00:00Z',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 'user-3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'staff',
    createdAt: '2023-02-10T00:00:00Z',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    id: 'user-4',
    name: 'John Johnson',
    email: 'john@example.com',
    role: 'manager',
    createdAt: '2023-03-05T00:00:00Z',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
  }
];