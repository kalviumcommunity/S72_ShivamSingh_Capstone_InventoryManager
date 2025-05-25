import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const roles = [
  {
    id: 'store_manager',
    title: 'Store Manager',
    description: 'Full access to manage inventory, users, and view analytics',
    permissions: [
      'Manage all inventory items',
      'Add/remove users',
      'View analytics dashboard',
      'Generate reports',
      'Manage roles and permissions'
    ]
  },
  {
    id: 'inventory_manager',
    title: 'Inventory Manager',
    description: 'Manage inventory and stock levels',
    permissions: [
      'Add/edit inventory items',
      'Update stock levels',
      'View inventory reports',
      'Manage categories'
    ]
  },
  {
    id: 'staff',
    title: 'Staff',
    description: 'Basic access to view and update inventory',
    permissions: [
      'View inventory items',
      'Update stock levels',
      'View basic reports'
    ]
  }
];

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/update-role', { role: selectedRole });
      setUser({ ...user, role: selectedRole });
      toast.success('Role updated successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to update role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white p-4">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Select Your Role</h1>
          <p className="text-xl text-gray-400">Choose the role that best fits your responsibilities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-xl cursor-pointer ${
                selectedRole === role.id
                  ? 'bg-orange-600 border-2 border-orange-400'
                  : 'bg-gray-800 border-2 border-transparent hover:border-gray-700'
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
              <p className="text-gray-400 mb-4">{role.description}</p>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-300">Permissions:</h4>
                <ul className="text-sm space-y-1">
                  {role.permissions.map((permission, index) => (
                    <li key={index} className="flex items-center text-gray-400">
                      <span className="mr-2">•</span>
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleRoleSelect}
            disabled={!selectedRole || isLoading}
            className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Continue to Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;