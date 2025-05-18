import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import api from '../../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      
      // Transform the response to match AuthContext User type
      const userData = {
        id: response.user._id,
        username: response.user.name,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the Firebase ID token
      const idToken = await user.getIdToken();
      
      // Create user object with required properties
      const userData = {
        id: user.uid,
        username: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email || undefined,
        name: user.displayName || undefined,
        role: 'Staff' // Default role for Google sign-in users
      };

      // Register the user in your backend
      try {
        const response = await api.post('/auth/google', {
          firebaseUid: user.uid,
          email: user.email,
          name: user.displayName,
          idToken: idToken
        });

        // Update user data with backend response
        const backendUserData = {
          id: response.data.user._id,
          username: response.data.user.name,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role
        };

        // Set auth state
        setUser(backendUserData);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(backendUserData));
        localStorage.setItem('auth_token', response.data.token);
        
        toast.success('Successfully logged in with Google!');
        navigate('/dashboard', { replace: true });
      } catch (error: any) {
        console.error('Backend registration error:', error);
        toast.error('Failed to register with backend');
        throw error;
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google');
      // Clean up on error
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      // Clear any existing auth data
      localStorage.removeItem('token');
      authService.logout();

      // Generate a random username for the guest
      const guestUsername = `Guest${Math.floor(Math.random() * 10000)}`;
      
      // Create guest user object
      const guestUser = {
        isGuest: true,
        username: guestUsername,
        id: `guest-${Date.now()}`, // Add a unique ID
      };

      // Set auth state
      setUser(guestUser);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('guestUser', JSON.stringify(guestUser));
      
      toast.success(`Welcome, ${guestUsername}!`);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Guest login error:', error);
      toast.error('Failed to login as guest');
      // Clean up on error
      localStorage.removeItem('guestUser');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] text-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#1c1f26] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#1c1f26] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-gray-300 hover:text-purple-400">
              Forgot Password ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0f1117] text-gray-400">Login with Google</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center p-3 rounded-lg bg-[#1c1f26] hover:bg-[#272a31] border border-gray-700 transition-colors duration-200"
            >
              <img src="/google.svg" alt="Google" className="w-6 h-6" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue as Guest
          </button>

          <p className="text-center text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-400 hover:text-purple-500">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login; 