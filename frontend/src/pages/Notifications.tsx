import React from 'react'
import {
  ExclamationTriangleIcon,
  UserIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  BellIcon,
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  type: 'alert' | 'activity'
  title: string
  message: string
  timestamp: string
  read: boolean
  icon: any
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Low Stock Alert',
    message: 'Product "Laptop Pro X" is running low on stock. Current quantity: 5',
    timestamp: '5 minutes ago',
    read: false,
    icon: ExclamationTriangleIcon,
  },
  {
    id: '2',
    type: 'activity',
    title: 'New Order Received',
    message: 'Order #12345 has been placed by John Doe',
    timestamp: '15 minutes ago',
    read: false,
    icon: ShoppingCartIcon,
  },
  {
    id: '3',
    type: 'activity',
    title: 'Inventory Update',
    message: 'Sarah Wilson updated the stock levels for "Wireless Mouse"',
    timestamp: '1 hour ago',
    read: true,
    icon: UserIcon,
  },
  {
    id: '4',
    type: 'alert',
    title: 'Stock Forecast',
    message: 'Based on current trends, "Gaming Headset" will be out of stock in 2 weeks',
    timestamp: '2 hours ago',
    read: true,
    icon: ChartBarIcon,
  },
]

const Notifications: React.FC = () => {
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Stay updated with your inventory alerts and activity logs.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
          {mockNotifications.map((notification) => (
            <li key={notification.id}>
              <div className={`px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <notification.icon
                        className={`h-6 w-6 ${
                          notification.type === 'alert'
                            ? 'text-red-500 dark:text-red-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex flex-col items-end space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{notification.timestamp}</p>
                    {!notification.read && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Empty State */}
      {mockNotifications.length === 0 && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700">
            <BellIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You're all caught up! Check back later for new updates.
          </p>
        </div>
      )}
    </div>
  )
}

export default Notifications 