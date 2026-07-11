import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import logo from '../assets/logo.png';

const LoginForm = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
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
    <div className="card max-w-md mx-auto">
      <img src={logo} alt="EMA EMITS College Philippines seal" className="h-16 w-16 object-contain mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
        <LogIn className="h-6 w-6" /> Sign In
      </h2>
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="input-field w-full"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field w-full"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" disabled={submitting} className="w-full btn-primary disabled:opacity-50">
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-900 font-medium">
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;