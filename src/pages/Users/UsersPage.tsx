import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users as UsersIcon, Search, UserPlus, XCircle } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import { mockUsers } from '../../data/mockData';
import { UserType } from '../../types/user';
import UserCard from '../../components/users/UserCard';
import CustomButton from '../../components/common/CustomButton';
import AddUserModal from '../../components/users/AddUserModal';

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState<UserType[]>(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = (userData: any) => {
    // Handle adding new user
    console.log('Adding new user:', userData);
    setShowAddModal(false);
  };

  if (currentUser?.role !== 'manager') {
    return (
      <Layout title="Unauthorized">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-error-100 mb-4">
            <XCircle className="h-8 w-8 text-error-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to view this page.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Users">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search users by name, email, or role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <CustomButton onClick={() => setShowAddModal(true)}>
          <UserPlus />
          Add User
        </CustomButton>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddUser}
          />
        )}
      </AnimatePresence>

      {filteredUsers.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <UsersIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">
            {searchQuery ? 'No users match your search criteria.' : 'Start by adding your first user.'}
          </p>
        </div>
      )}
    </Layout>
  );
};

export default UsersPage;