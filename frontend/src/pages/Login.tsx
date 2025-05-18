import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGuestLogin = async () => {
    try {
      // Handle guest login here
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to login as guest');
    }
  };

  const goToLanding = () => {
    navigate('/');
  };

  // Add this after component mounts
  useEffect(() => {
    // Create a floating back button
    const backButton = document.createElement('button');
    backButton.innerHTML = '<strong style="font-size: 24px;">←</strong> <span>Back</span>';
    backButton.onclick = goToLanding;
    backButton.style.position = 'fixed';
    backButton.style.top = '10px';
    backButton.style.left = '10px';
    backButton.style.zIndex = '99999';
    backButton.style.padding = '10px 15px';
    backButton.style.color = 'white';
    backButton.style.backgroundColor = '#6366f1';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '8px';
    backButton.style.fontWeight = 'bold';
    backButton.style.cursor = 'pointer';
    backButton.style.display = 'flex';
    backButton.style.alignItems = 'center';
    backButton.style.gap = '8px';
    backButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    document.body.appendChild(backButton);
    
    // Clean up on unmount
    return () => {
      document.body.removeChild(backButton);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1117] relative">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-white text-center mb-8">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Username</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-[#1c1f26] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-[#1c1f26] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-purple-400">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors mt-6"
            >
              Sign in
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0f1117] text-gray-400">Login with Google</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center py-3 px-4 bg-[#1c1f26] border border-gray-700 rounded-lg text-white hover:bg-[#2a2d35] transition-colors"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
              Google
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-3 px-4 bg-[#2a2d35] text-white rounded-lg hover:bg-[#353841] transition-colors"
            >
              Continue as Guest
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-purple-500 hover:text-purple-400">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 