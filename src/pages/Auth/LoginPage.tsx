import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Form } from '../../components/common/Form';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const { login, loginWithGoogle, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login with Google');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4 auth-page">
      <Form title="Sign In" onSubmit={handleSubmit}>
        {(error || authError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">{error || authError}</p>
          </div>
        )}
        <input
          type="email"
          name="email"
          className="input"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          className="input"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        <button type="submit" className="btn">
          Sign In
        </button>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-outline flex items-center justify-center gap-2"
        >
          <FcGoogle className="w-5 h-5" />
          Sign in with Google
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-800">
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default LoginPage;