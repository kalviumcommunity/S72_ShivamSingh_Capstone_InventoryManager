import React, { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClipboardDocumentListIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import inventoryService, { InventoryItem } from '../services/inventoryService'
import AddItemForm from '../components/AddItemForm'
import toast from 'react-hot-toast'
import ModalPortal from '../components/ModalPortal'

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editItem, setEditItem] = useState<InventoryItem | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categoriesWithItems, setCategoriesWithItems] = useState<Set<string>>(new Set())

  // Static categories with image URLs and names
  const categories = [
    { name: 'Mobiles & Tablets', img: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-21.png' },
    { name: 'Computers & Laptops', img: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-22.png' },
    { name: 'TVs & Electronics', img: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-23.png' },
    { name: 'Home Appliances', img: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-24.png' },
    { name: 'Paan Corner', img: '/paan-corner_web.jpg' },
    { name: 'Dairy, Bread & Eggs', img: '/Slice-2_10.jpg' },
    { name: 'Fruits & Vegetables', img: '/Slice-3_9.jpg' },
    { name: 'Cold Drinks & Juices', img: '/Slice-4_9.jpg' },
    { name: 'Snacks & Munchies', img: 'Slice-5_4.jpg' },
    { name: 'Breakfast & Instant Food', img: '/Slice-6_5.jpg' },
    { name: 'Sweet Tooth', img: '/Slice-7_3.jpg' },
    { name: 'Bakery & Biscuits', img: '/Slice-8_4.jpg' },
    { name: 'Tea, Coffee & Health Drink', img: '/Slice-9_3.jpg' },
    { name: 'Atta, Rice & Dal', img: '/Slice-10.jpg' },
    { name: 'Masala, Oil & More', img: '/Slice-11.jpg' },
    { name: 'Sauces & Spreads', img: '/Slice-12.jpg' },
    { name: 'Chicken, Meat & Fish', img: '/Slice-13.jpg' },
    { name: 'Organic & Healthy Living', img: '/Slice-14.jpg' },
    { name: 'Baby Care', img: '/Slice-15.jpg' },
    { name: 'Pharma & Wellness', img: '/Slice-16.jpg' },
    { name: 'Cleaning Essentials', img: '/Slice-17.jpg' },
    { name: 'Home & Office', img: '/Slice-18.jpg' },
    { name: 'Personal Care', img: '/Slice-19.jpg' },
    { name: 'Pet Care', img: '/Slice-20.jpg' },
  ];

  // Fetch items on component mount
  useEffect(() => {
    fetchItems()
  }, [])

  // Update categories with items whenever items change
  useEffect(() => {
    const categories = new Set(items.map(item => item.category))
    setCategoriesWithItems(categories)
  }, [items])

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const data = await inventoryService.getItems()
      setItems(data)
    } catch (error) {
      toast.error('Failed to fetch inventory items')
      console.error('Error fetching items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddItem = async (formData: any) => {
    try {
      setIsSubmitting(true)
      await inventoryService.createItem(formData)
      toast.success('Item added successfully')
      setIsAddModalOpen(false)
      fetchItems() // Refresh the items list
    } catch (error) {
      toast.error('Failed to add item')
      console.error('Error adding item:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = (item: InventoryItem) => {
    setIsAddModalOpen(false)
    setEditItem(item)
    setIsEditModalOpen(true)
  }

  const handleAddClick = () => {
    setIsEditModalOpen(false)
    setIsAddModalOpen(true)
  }

  const handleEditItem = async (formData: any) => {
    if (!editItem) return;
    try {
      setIsSubmitting(true);
      const response = await inventoryService.updateItem(editItem.id, formData);
      toast.success('Item updated successfully');
      setIsEditModalOpen(false);
      setEditItem(null);
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      handleDeleteItem(itemId)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      setIsDeleting(itemId)
      await inventoryService.deleteItem(itemId)
      toast.success('Item deleted successfully')
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete item')
      console.error('Error deleting item:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  // Filter items by selectedCategory
  const filteredItems = items.filter(item =>
    (!selectedCategory || item.category === selectedCategory) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Empty State Component
  const EmptyState = () => (
    <div className="text-center py-12">
      <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No items in inventory</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by adding your first inventory item.
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={handleAddClick}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Add Item
        </button>
      </div>
    </div>
  )

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Category View
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Categories</h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Select a category to view its items
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={handleAddClick}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Item
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map(category => {
            const hasItems = categoriesWithItems.has(category.name)
            if (!hasItems) return null // Skip categories without items
            
            return (
              <div
                key={category.name}
                className="flex flex-col items-center bg-transparent group focus:outline-none"
                style={{ minHeight: 260 }}
              >
                <button
                  onClick={() => setSelectedCategory(category.name)}
                  className="flex items-center justify-center w-32 h-36 sm:w-40 sm:h-40 mb-2 overflow-hidden border-2 border-gray-300 rounded-xl transition-all duration-200 group-hover:border-indigo-500 group-hover:shadow-lg focus:outline-none"
                  style={{ background: '#fff' }}
                  tabIndex={0}
                  aria-label={`View items in ${category.name}`}
                >
                  <img 
                    src={category.img} 
                    alt={category.name} 
                    className="w-full h-full object-cover rounded-xl" 
                  />
                </button>
                <span className="text-base font-medium text-white text-center mt-2" style={{lineHeight: '1.2'}}>{category.name}</span>
                <span className="text-xs text-white mt-1 text-center">
                  {items.filter(item => item.category === category.name).length} items
                </span>
              </div>
            )
          })}
        </div>

        {/* Add Item Modal */}
        {isAddModalOpen && (
          <ModalPortal isOpen={isAddModalOpen}>
            <AddItemForm
              onSubmit={handleAddItem}
              onClose={() => setIsAddModalOpen(false)}
              isSubmitting={isSubmitting}
              isOpen={isAddModalOpen}
              initialData={selectedCategory ? { category: selectedCategory } : undefined}
            />
          </ModalPortal>
        )}
      </div>
    )
  }

  // Items View for Selected Category
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Categories
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{selectedCategory}</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage items in this category
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAddClick}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
          placeholder="Search items..."
        />
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
              <div className="flex-1">
                {item.image && (
                  <img
                    src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL}${item.image}`}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.name}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Qty: {item.quantity}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Price: ₹{item.price.toFixed(2)}</div>
                <div className="mt-2">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" 
                  onClick={() => handleEditClick(item)}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button 
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" 
                  onClick={() => handleDeleteClick(item.id)} 
                  disabled={isDeleting === item.id}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <ModalPortal isOpen={isAddModalOpen}>
          <AddItemForm
            onSubmit={handleAddItem}
            onClose={() => setIsAddModalOpen(false)}
            isSubmitting={isSubmitting}
            isOpen={isAddModalOpen}
            initialData={selectedCategory ? { category: selectedCategory } : undefined}
          />
        </ModalPortal>
      )}

      {/* Edit Item Modal */}
      {isEditModalOpen && (
        <ModalPortal isOpen={isEditModalOpen}>
          <AddItemForm
            onSubmit={handleEditItem}
            onClose={() => { setIsEditModalOpen(false); setEditItem(null); }}
            isSubmitting={isSubmitting}
            initialData={{ ...editItem, minimumQuantity: (editItem as any).minimumQuantity ?? 1 }}
            isEdit={true}
            isOpen={isEditModalOpen}
          />
        </ModalPortal>
      )}
    </div>
  )
}

export default Inventory 