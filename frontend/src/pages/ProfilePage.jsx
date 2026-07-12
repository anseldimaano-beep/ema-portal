import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortalLogin from '../components/PortalLogin';
import PortalSidebar from '../components/PortalSidebar';
import api from '../services/api';

const STATUS_STYLES = {
  enrolled: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  suspended: 'bg-red-100 text-red-700',
  graduated: 'bg-blue-100 text-blue-700',
  dropped: 'bg-gray-200 text-gray-600',
};

const STATUS_LABELS = {
  enrolled: 'Enrolled',
  pending: 'Pending',
  suspended: 'Suspended',
  graduated: 'Graduated',
  dropped: 'Dropped',
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-800 font-medium">{value || '—'}</span>
  </div>
);

const ProfilePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get('/finance/my-account/')
      .then((res) => setAccount(res.data))
      .catch(() => setAccount(null));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <PortalLogin />;
  }

  const status = user?.enrollment_status || 'pending';
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const statusLabel = STATUS_LABELS[status] || status;

  return (
    <div className="flex min-h-screen bg-white">
      <PortalSidebar />
      <div className="flex-1 min-w-0 p-6 md:p-8 max-w-3xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Profile</h1>

        <section className="rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-primary-50 px-4 py-2 font-semibold text-gray-700 text-sm tracking-wide flex items-center justify-between">
            <span>STATUS</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>
              {statusLabel}
            </span>
          </div>
          <div className="p-4 text-sm">
            <InfoRow label="Term" value={account?.term_display} />
            <InfoRow label="Year Level" value={user?.year_level ? `${user.year_level}${['th', 'st', 'nd', 'rd'][user.year_level % 10] || 'th'} Year` : null} />
            <InfoRow label="Section" value={user?.section} />
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-primary-50 px-4 py-2 font-semibold text-gray-700 text-sm tracking-wide">
            PERSONAL INFORMATION
          </div>
          <div className="p-4 text-sm">
            <InfoRow label="Full Name" value={user?.full_name} />
            <InfoRow label="Student Number" value={user?.username} />
            <InfoRow label="Email" value={user?.email} />
            <InfoRow label="Program" value={user?.program} />
            <InfoRow label="Phone" value={user?.phone} />
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-primary-50 px-4 py-2 font-semibold text-gray-700 text-sm tracking-wide">
            FINANCE SNAPSHOT
          </div>
          <div className="p-4 text-sm">
            {account?.exists === false ? (
              <p className="text-gray-400">No fee account has been set up yet.</p>
            ) : (
              <>
                <InfoRow
                  label="Tuition Fee"
                  value={account ? Number(account.tuition_fee).toFixed(2) : '—'}
                />
                <InfoRow
                  label="Miscellaneous Fee"
                  value={account ? Number(account.misc_fee).toFixed(2) : '—'}
                />
                <InfoRow
                  label="Outstanding Balance"
                  value={account ? Number(account.total_balance).toFixed(2) : '—'}
                />
              </>
            )}
            <div className="pt-3 flex gap-4 text-primary-700 text-sm font-medium">
              <Link to="/my-payments" className="hover:underline">View My Payments</Link>
              <Link to="/other-fees" className="hover:underline">View Test Permits</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
