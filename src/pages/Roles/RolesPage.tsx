import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, Plus, Users, Grid } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import styled from 'styled-components';
import CustomButton from '../../components/common/CustomButton';
import AddRoleModal from '../../components/roles/AddRoleModal';

const roles = [
  {
    id: 'manager',
    name: 'Store Manager',
    description: 'Full access to all features including user management and critical operations',
    permissions: [
      'View inventory',
      'Manage inventory',
      'View users',
      'Manage users',
      'View reports',
      'Manage settings',
      'Delete records'
    ]
  },
  {
    id: 'staff',
    name: 'Staff Member',
    description: 'Limited access to view inventory and perform basic operations',
    permissions: [
      'View inventory',
      'Update stock levels',
      'View reports',
      'View personal profile'
    ]
  }
];

const RolesPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRole = (roleData: any) => {
    // Handle adding new role
    console.log('Adding new role:', roleData);
    setShowAddModal(false);
  };

  if (user?.role !== 'manager') {
    return (
      <Layout title="Unauthorized">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-error-100 mb-4">
            <Shield className="h-8 w-8 text-error-600" />
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
    <Layout title="Role Management">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search roles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <CustomButton onClick={() => setShowAddModal(true)}>
          <Plus />
          Add Role
        </CustomButton>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddRoleModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddRole}
          />
        )}
      </AnimatePresence>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {filteredRoles.map((role, index) => (
          <StyledCard key={role.id}>
            <div className="card">
              <div className="card-content">
                <div className="card-top">
                  <span className="card-title">{String(index + 1).padStart(2, '0')}.</span>
                  <p>{role.name}</p>
                </div>
                <div className="card-bottom">
                  <p>{role.permissions.length} Permissions</p>
                  <Grid />
                </div>
              </div>
              <div className="card-image">
                {role.id === 'manager' ? <Shield /> : <Users />}
              </div>
            </div>
          </StyledCard>
        ))}
      </motion.div>
    </Layout>
  );
};

const StyledCard = styled.div`
  .card {
    width: 100%;
    background: #fff;
    color: black;
    position: relative;
    border-radius: 2.5em;
    padding: 2em;
    transition: transform 0.4s ease;
  }

  .card .card-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 5em;
    height: 100%;
    transition: transform 0.4s ease;
  }

  .card .card-top,
  .card .card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card .card-top p,
  .card .card-top .card-title,
  .card .card-bottom p {
    margin: 0;
  }

  .card .card-title {
    font-weight: bold;
  }

  .card .card-top p,
  .card .card-bottom p {
    font-weight: 600;
  }

  .card .card-bottom {
    align-items: flex-end;
  }

  .card .card-image {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
  }

  .card .card-image svg {
    width: 4em;
    height: 4em;
    transition: transform 0.4s ease;
    opacity: 0.1;
  }

  .card:hover {
    cursor: pointer;
    transform: scale(0.97);
  }

  .card:hover .card-content {
    transform: scale(0.96);
  }

  .card:hover .card-image svg {
    transform: scale(1.05);
  }

  .card:active {
    transform: scale(0.9);
  }
`;

export default RolesPage;