import React from 'react'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'increase',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Total Items',
    value: '2,345',
    change: '+12.3%',
    changeType: 'increase',
    icon: CubeIcon,
  },
  {
    name: 'Low Stock Items',
    value: '12',
    change: '-2.4%',
    changeType: 'decrease',
    icon: ExclamationTriangleIcon,
  },
  {
    name: 'Monthly Growth',
    value: '+15.2%',
    change: '+4.3%',
    changeType: 'increase',
    icon: ChartBarIcon,
  },
]

const recentActivity = [
  {
    id: 1,
    user: 'John Doe',
    action: 'Added new inventory item',
    target: 'Product XYZ',
    time: '3 minutes ago',
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'Updated stock levels',
    target: 'Product ABC',
    time: '15 minutes ago',
  },
  {
    id: 3,
    user: 'Mike Johnson',
    action: 'Created new order',
    target: 'Order #12345',
    time: '1 hour ago',
  },
  {
    id: 4,
    user: 'Sarah Wilson',
    action: 'Generated report',
    target: 'Monthly Inventory Report',
    time: '2 hours ago',
  },
]

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.changeType === 'increase' ? (
                  <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                ) : (
                  <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
                )}
                <span className="sr-only">{stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                      {activity.user}
                    </p>
                    <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {activity.action} - {activity.target}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Inventory Trends Chart */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Inventory Trends</h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Chart will be implemented here
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 