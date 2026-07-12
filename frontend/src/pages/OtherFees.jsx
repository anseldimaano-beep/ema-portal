import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PortalLogin from '../components/PortalLogin';
import PortalSidebar from '../components/PortalSidebar';
import api from '../services/api';

const EXAM_ORDER = ['prelim', 'midterm', 'prefinal', 'final'];

const PermitCard = ({ permit }) => {
  const released = permit.status === 'released';
  return (
    <div
      className={`rounded-lg border overflow-hidden ${
        released ? 'border-green-200' : 'border-gray-200'
      }`}
    >
      <div
        className={`px-4 py-2 font-semibold text-sm tracking-wide flex items-center justify-between ${
          released ? 'bg-green-50 text-green-800' : 'bg-primary-50 text-gray-700'
        }`}
      >
        <span>{permit.exam_type_display?.toUpperCase() || permit.exam_type.toUpperCase()}</span>
        {released ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : (
          <Lock className="h-4 w-4 text-gray-400" />
        )}
      </div>
      <div className="p-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Permit Status</span>
          <span className={`font-semibold ${released ? 'text-green-700' : 'text-red-600'}`}>
            {released ? 'Released' : 'Locked'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Required Payment</span>
          <span className="text-gray-800">{Number(permit.required_percent).toFixed(0)}% of fees</span>
        </div>
        {permit.remarks && (
          <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">{permit.remarks}</p>
        )}
        {!released && (
          <p className="text-xs text-gray-400 pt-1">
            Settle your balance in{' '}
            <Link to="/my-payments" className="text-primary-700 hover:underline">
              My Payments
            </Link>{' '}
            to unlock this permit.
          </p>
        )}
      </div>
    </div>
  );
};

const OtherFees = () => {
  const { isAuthenticated } = useAuth();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get('/finance/my-account/')
      .then((res) => setAccount(res.data))
      .catch(() => setAccount(null))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <PortalLogin />;
  }

  const hasAccount = account && account.exists !== false;
  const permits = hasAccount
    ? [...account.exam_permits].sort(
        (a, b) => EXAM_ORDER.indexOf(a.exam_type) - EXAM_ORDER.indexOf(b.exam_type)
      )
    : [];

  return (
    <div className="flex min-h-screen bg-white">
      <PortalSidebar />
      <div className="flex-1 min-w-0 p-6 md:p-8 max-w-3xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-1">Other Fees</h1>
        <p className="text-sm text-gray-500 mb-6">
          Test permits for each grading period, released once the required portion of your
          balance is settled.
        </p>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : !hasAccount ? (
          <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-400">
            No test permits are available yet. They're generated once your fee assessment is posted.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {permits.map((permit) => (
              <PermitCard key={permit.id} permit={permit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherFees;
