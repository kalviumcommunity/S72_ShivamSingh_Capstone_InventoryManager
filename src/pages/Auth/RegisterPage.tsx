import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Form } from '../../components/common/Form';
import { FcGoogle } from 'react-icons/fc';
import { UserRole } from '../../types/user';

const RegisterPage = () => {
  const { signup, loginWithGoogle, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff' as UserRole,
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name, formData.role);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error('Google signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-page" style={{ background: 'white' }}>
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-3xl">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-4 order-1 md:order-none">
          <Form title="Sign Up" onSubmit={handleSubmit}>
            {(error || authError) && (
              <div className="mb-1 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-xs text-center">{error || authError}</p>
              </div>
            )}
            <input
              type="text"
              name="name"
              className="input mb-1 text-sm py-2"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
            <input
              type="email"
              name="email"
              className="input mb-1 text-sm py-2"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              className="input mb-1 text-sm py-2"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <input
              type="password"
              name="confirmPassword"
              className="input mb-1 text-sm py-2"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <select
              name="role"
              className="input mb-2 text-sm py-2"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="staff">Staff Member</option>
              <option value="manager">Store Manager</option>
            </select>
            <button type="submit" className="btn mb-1 text-sm py-2 px-4">
              Create Account
            </button>
            
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white/80 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="btn btn-outline flex items-center justify-center gap-2 mb-1 text-sm py-2 px-4"
            >
              <FcGoogle className="w-5 h-5" />
              Sign up with Google
            </button>

            <p className="text-center mt-1 text-xs text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-800">
                Sign in
              </Link>
            </p>
          </Form>
        </div>
        {/* Right: Illustration */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-4 order-2">
          <img
            src="/signup-illustration.png"
            alt="Sign up illustration"
            className="max-w-full h-auto object-contain"
            style={{ minHeight: '180px', maxHeight: '220px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;