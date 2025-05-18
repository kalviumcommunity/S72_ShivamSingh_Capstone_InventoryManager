import React from 'react';

const Orders: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Orders</h1>
        <p className="text-gray-400">Manage your orders and track their status</p>
      </div>

      {/* Orders Table */}
      <div className="bg-[#1c1f26] rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                New Order
              </button>
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Filter
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="w-64 px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm">
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr className="text-gray-300">
                  <td className="px-6 py-4">#12345</td>
                  <td className="px-6 py-4">2024-02-20</td>
                  <td className="px-6 py-4">John Doe</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4">$299.99</td>
                  <td className="px-6 py-4">
                    <button className="text-purple-400 hover:text-purple-300">View</button>
                  </td>
                </tr>
                <tr className="text-gray-300">
                  <td className="px-6 py-4">#12346</td>
                  <td className="px-6 py-4">2024-02-20</td>
                  <td className="px-6 py-4">Jane Smith</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4">$149.99</td>
                  <td className="px-6 py-4">
                    <button className="text-purple-400 hover:text-purple-300">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders; 