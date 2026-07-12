import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';
import { COLLEGE_NAME, COLLEGE_FACEBOOK_URL } from '../utils/constants';

// Full-screen, split login matching the reference school-portal design:
// left panel = announcements + quick links, right panel = the sign-in card.
const PortalLogin = ({ announcement }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
    } catch (err) {
      const message =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.error ||
        'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-100">
      {/* Left: announcements + quick links */}
      <div className="hidden md:flex flex-col items-center justify-center px-10 text-center">
        <p className="text-gray-400 text-lg mb-10">
          {announcement || 'No announcement.'}
        </p>
        <div className="flex gap-10">
          {COLLEGE_FACEBOOK_URL && (
            <a
              href={COLLEGE_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <span className="h-16 w-16 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
                <img src={logo} alt="" className="h-12 w-12 object-contain" />
              </span>
              Facebook Page
            </a>
          )}
          <Link
            to="/"
            className="flex flex-col items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <span className="h-16 w-16 rounded-full bg-white shadow flex items-center justify-center text-2xl">
              🏠
            </span>
            College Homepage
          </Link>
          <Link
            to="/register"
            className="flex flex-col items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <span className="h-16 w-16 rounded-full bg-white shadow flex items-center justify-center text-2xl">
              📝
            </span>
            Freshmen Registration
          </Link>
        </div>
      </div>

      {/* Right: sign-in card */}
      <div className="flex items-center justify-center px-6 py-16 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt={`${COLLEGE_NAME} seal`} className="h-24 w-24 object-contain mb-4" />
            <h1 className="text-2xl text-gray-700">{COLLEGE_NAME}</h1>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-800 hover:bg-primary-900 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50"
            >
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="flex justify-between text-sm mt-6">
            <Link to="/contact" className="text-primary-700 hover:underline">
              Need help logging in?
            </Link>
            <Link to="/forgot-password" className="text-primary-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-900 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;
