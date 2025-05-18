import api from './api';
import axios from 'axios';

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  companyName: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  companyName: string;
  profileImage?: string;
}

interface UpdateProfileData {
  name: string;
  email: string;
  companyName: string;
  profileImage?: File;
}

const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email: data.email,
      password: data.password
    });
    if (response.data.token) {
      // If remember me is true, store in localStorage, otherwise in sessionStorage
      const storage = data.rememberMe ? localStorage : sessionStorage;
      storage.setItem('auth_token', response.data.token);
      storage.setItem('user', JSON.stringify(response.data.user));
      // Update authentication state
      window.dispatchEvent(new Event('authStateChanged'));
    }
    return response.data;
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      companyName: data.companyName,
      role: data.role
    });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Update authentication state
      window.dispatchEvent(new Event('authStateChanged'));
    }
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.patch('/auth/reset-password', { 
      token,
      password,
      passwordConfirm: password
    });
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.patch('/auth/update-password', { currentPassword, newPassword });
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    window.dispatchEvent(new Event('authStateChanged'));
  },

  isAuthenticated(): boolean {
    return !!(localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  },

  updateProfile: async (data: FormData) => {
    try {
      // Get the token
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.put('/auth/update-profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update stored user data if update was successful
      if (response.data.success && response.data.data.user) {
        const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage;
        const updatedUser = response.data.data.user;
        
        // Ensure we're storing the complete user object
        storage.setItem('user', JSON.stringify({
          ...JSON.parse(storage.getItem('user') || '{}'),
          ...updatedUser
        }));

        // Update authentication state
        window.dispatchEvent(new Event('authStateChanged'));
      }
      return response.data;
    } catch (error: any) {
      // Log the error for debugging
      console.error('Profile update error:', error.response || error);
      
      if (error.response?.status === 401) {
        // Handle unauthorized error (token expired or invalid)
        authService.logout();
        window.location.href = '/login';
      }
      
      throw error;
    }
  },
};

export default authService; 