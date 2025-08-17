import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Key, Save, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic here
    setIsEditing(false);
  };

  return (
    <Layout title="Profile">
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-3xl font-semibold text-primary-700">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2
                ${user?.role === 'manager' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}>
                {user?.role === 'manager' ? 'Store Manager' : 'Staff Member'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
              <button 
                className="btn btn-outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10 input w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10 input w-full"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="pt-4">
                  <button type="submit" className="btn btn-primary flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Change Password</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="pl-10 input w-full"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="pl-10 input w-full"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 input w-full"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="btn btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>

          <div className="card bg-error-50 border-error-100">
            <h2 className="text-lg font-semibold text-error-800 mb-4">Danger Zone</h2>
            <p className="text-error-600 text-sm mb-4">
              Once you log out, you'll need to sign in again to access your account.
            </p>
            <button 
              onClick={logout}
              className="btn btn-error flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ProfilePage;