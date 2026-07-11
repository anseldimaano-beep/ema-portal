import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_OPTIONS, POSITION_OPTIONS, ADMIN_ELIGIBLE_POSITIONS } from '../utils/constants';
import logo from '../assets/logo.png';

const initialForm = {
  email: '',
  password: '',
  password_confirm: '',
  username: '',
  first_name: '',
  last_name: '',
  role: 'student',
  leadership_position: 'regular',
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const showPosition = form.role === 'faculty' || form.role === 'organization';
  const positionChoices = POSITION_OPTIONS[form.role] || [];
  const willBeAdmin = showPosition && ADMIN_ELIGIBLE_POSITIONS.includes(form.leadership_position);

  const handleRoleChange = (role) => {
    setForm((f) => ({ ...f, role, leadership_position: 'regular' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    if (form.password !== form.password_confirm) {
      setErrors({ password_confirm: 'Passwords do not match.' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!showPosition) delete payload.leadership_position;

      const data = await register(payload);
      setSuccess(data.message || 'Registration successful. You can now sign in.');
      setForm(initialForm);
      setTimeout(() => navigate('/student-portal'), 1500);
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: ['Registration failed. Please try again.'] });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (name) => {
    const val = errors[name];
    if (!val) return null;
    return Array.isArray(val) ? val.join(' ') : val;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="card">
        <img src={logo} alt="EMA EMITS College Philippines seal" className="h-16 w-16 object-contain mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <UserPlus className="h-6 w-6" /> Create Account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Step 1: your email and password. Step 2: how should we classify you?
        </p>

        {errors.non_field_errors && (
          <div className="mb-4 text-red-600 text-sm">{fieldError('non_field_errors')}</div>
        )}
        {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: credentials */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="input-field w-full"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {fieldError('email') && <p className="text-red-600 text-xs mt-1">{fieldError('email')}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="input-field w-full"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {fieldError('password') && <p className="text-red-600 text-xs mt-1">{fieldError('password')}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm password"
              className="input-field w-full"
              required
              minLength={8}
              value={form.password_confirm}
              onChange={(e) => setForm({ ...form, password_confirm: e.target.value })}
            />
            {fieldError('password_confirm') && (
              <p className="text-red-600 text-xs mt-1">{fieldError('password_confirm')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="First name"
              className="input-field w-full"
              required
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last name"
              className="input-field w-full"
              required
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Student/Employee ID (e.g. 2026-00123 or EMP-004)"
              className="input-field w-full"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            {fieldError('username') && <p className="text-red-600 text-xs mt-1">{fieldError('username')}</p>}
          </div>

          {/* Step 2: classification */}
          <div className="pt-2 border-t border-gray-200">
            <label className="block text-sm font-medium mb-2">Classification</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleRoleChange(opt.value)}
                  className={`text-sm px-3 py-2 rounded border ${
                    form.role === opt.value
                      ? 'bg-primary-900 text-white border-primary-900'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {fieldError('role') && <p className="text-red-600 text-xs mt-1">{fieldError('role')}</p>}
          </div>

          {showPosition && (
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <select
                className="input-field w-full"
                value={form.leadership_position}
                onChange={(e) => setForm({ ...form, leadership_position: e.target.value })}
              >
                {positionChoices.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {willBeAdmin && (
                <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 flex items-start gap-1.5">
                  <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                  This position requires approval from an existing Admin before Admin access is granted.
                  Your account will work as a regular {form.role === 'faculty' ? 'Teacher' : 'Organization'} account until then.
                </p>
              )}
            </div>
          )}

          <button type="submit" disabled={submitting} className="w-full btn-primary disabled:opacity-50">
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/student-portal" className="text-primary-900 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
