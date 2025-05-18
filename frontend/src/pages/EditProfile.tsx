import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import authService from '../services/authService';

// Add API URL constant
const API_URL = 'http://localhost:5000';

interface ProfileFormData {
  name: string;
  email: string;
  companyName: string;
  profileImage?: File | null;
}

const EditProfile: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    user?.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `${API_URL}${user.profileImage}`) : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    companyName: user?.companyName || '',
    profileImage: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('companyName', formData.companyName);
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      const response = await authService.updateProfile(formDataToSend);
      
      if (response.data.user) {
        setUser(response.data.user);
      }

      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Check if user is a guest
  const isGuest = user?.isGuest;

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="max-w-2xl mx-auto relative">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>
        
        <div className={`bg-[#1c1f26] rounded-lg p-6 relative ${isGuest ? 'filter blur-sm' : ''}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div 
                  onClick={triggerFileInput}
                  className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center text-3xl cursor-pointer relative overflow-hidden group"
                >
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `${API_URL}/uploads/profiles/default.jpg`;
                      }}
                    />
                  ) : (
                    formData.name ? formData.name[0].toUpperCase() : '👤'
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm">Change Photo</span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isGuest}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your full name"
                disabled={isGuest}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                disabled={isGuest}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your company name"
                disabled={isGuest}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                disabled={isGuest}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isGuest}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Overlay for guest users */}
        {isGuest && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-[#1c1f26] p-8 rounded-lg shadow-xl text-center max-w-md mx-auto border border-purple-500">
              <h2 className="text-2xl font-bold text-white mb-4">Create an Account</h2>
              <p className="text-gray-300 mb-6">
                Sign up or log in to edit your profile and access all features.
              </p>
              <div className="space-y-4">
                <Link
                  to="/signup"
                  className="block w-full py-3 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center font-medium"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="block w-full py-3 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-center font-medium"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;