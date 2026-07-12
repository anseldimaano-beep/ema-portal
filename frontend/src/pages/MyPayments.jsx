import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PortalLogin from '../components/PortalLogin';
import PortalSidebar from '../components/PortalSidebar';
import api from '../services/api';

const peso = (v) => `₱${Number(v ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const FeeCard = ({ title, fee, paid, balance }) => (
  <div className="rounded-lg border border-gray-200 overflow-hidden">
    <div className="bg-primary-50 px-4 py-2 font-semibold text-gray-700 text-sm tracking-wide">
      {title}
    </div>
    <div className="p-4 text-sm space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-500">Total Assessment</span>
        <span className="font-medium text-gray-800">{peso(fee)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Amount Paid</span>
        <span className="font-medium text-green-700">{peso(paid)}</span>
      </div>
      <div className="flex justify-between border-t border-gray-100 pt-2">
        <span className="text-gray-500">Balance</span>
        <span className={`font-semibold ${Number(balance) > 0 ? 'text-red-600' : 'text-green-700'}`}>
          {peso(balance)}
        </span>
      </div>
    </div>
  </div>
);

const MyPayments = () => {
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
  const percentPaid = hasAccount ? Number(account.percent_paid) : 0;

  return (
    <div className="flex min-h-screen bg-white">
      <PortalSidebar />
      <div className="flex-1 min-w-0 p-6 md:p-8 max-w-3xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-1">My Payments</h1>
        <p className="text-sm text-gray-500 mb-6">{hasAccount ? account.term_display : ''}</p>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : !hasAccount ? (
          <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-400">
            No fee assessment has been posted for you yet. Please check back once enrollment
            is finalized, or contact the Cashier's Office.
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <FeeCard
                title="TUITION FEE"
                fee={account.tuition_fee}
                paid={account.tuition_paid}
                balance={account.tuition_balance}
              />
              <FeeCard
                title="MISCELLANEOUS FEE"
                fee={account.misc_fee}
                paid={account.misc_paid}
                balance={account.misc_balance}
              />
            </div>

            <section className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-primary-50 px-4 py-2 font-semibold text-gray-700 text-sm tracking-wide">
                TOTAL BALANCE
              </div>
              <div className="p-6 text-center">
                <p className="text-2xl font-semibold text-gray-800">
                  {peso(account.total_balance)}
                </p>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(percentPaid, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {percentPaid.toFixed(2)}% of {peso(account.total_fee)} paid
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPayments;
