import React, { useState, useEffect } from 'react'
import {
  UserGroupIcon,
  KeyIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  companyName: string;
}

const Settings: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      await api.patch(`/users/${userId}`, { status: newStatus });
      toast.success('User status updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  // Only allow access if user is admin
  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage user roles and permissions for your inventory system.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <li key={user._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.companyName}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:border-orange-500 focus:ring-orange-500 dark:text-white"
                    >
                      <option value="admin">Admin</option>
                      <option value="store-manager">Store Manager</option>
                      <option value="employee">Employee</option>
                      <option value="store-worker">Store Worker</option>
                    </select>
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user._id, e.target.value as 'active' | 'inactive')}
                      className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:border-orange-500 focus:ring-orange-500 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Role Permissions Info */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Role Permissions</h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Admin</h4>
                <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>Full system access</li>
                  <li>User management</li>
                  <li>Role management</li>
                  <li>All features access</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Store Manager</h4>
                <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>Inventory management</li>
                  <li>Order management</li>
                  <li>Reports access</li>
                  <li>Staff management</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Employee</h4>
                <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>Basic inventory access</li>
                  <li>Order processing</li>
                  <li>Limited reports</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Store Worker</h4>
                <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>View inventory</li>
                  <li>Update stock levels</li>
                  <li>Basic notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;