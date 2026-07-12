import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import logo from '../assets/logo.png';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('This verification link is missing its token.');
      return;
    }

    api
      .post('/auth/verify-email/', { token })
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'This verification link is invalid or has expired.');
      });
  }, [token]);

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="card text-center">
        <img src={logo} alt="EMA EMITS College Philippines seal" className="h-16 w-16 object-contain mx-auto mb-4" />

        {status === 'verifying' && (
          <>
            <Loader2 className="h-10 w-10 mx-auto mb-4 animate-spin text-blue-600" />
            <h2 className="text-2xl font-bold mb-2">Verifying your email…</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold mb-2">Email Verified</h2>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <Link to="/student-portal" className="btn-primary inline-block">
              Sign In
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-10 w-10 mx-auto mb-4 text-red-600" />
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-sm text-red-600 mb-6">{message}</p>
            <Link to="/register" className="btn-primary inline-block">
              Back to Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
