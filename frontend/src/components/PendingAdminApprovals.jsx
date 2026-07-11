import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import api from '../services/api';

const POSITION_LABELS = {
  department_head: 'Department Head',
  principal: 'Principal',
  president: 'President (EEMG)',
};

const PendingAdminApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/auth/admin-requests/')
      .then((res) => setRequests(res.data.results || res.data || []))
      .catch(() => setError('Could not load pending admin requests.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id) => {
    setBusyId(id);
    setError('');
    try {
      await api.post(`/auth/admin-requests/${id}/approve/`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Approval failed.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5" /> Pending Admin Requests
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Teacher / Organization accounts that selected a leadership position and are waiting for Admin approval.
      </p>

      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-gray-500">No pending requests.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="flex items-center justify-between border border-gray-200 rounded p-3">
              <div>
                <p className="font-medium">{r.full_name || `${r.first_name} ${r.last_name}`}</p>
                <p className="text-xs text-gray-500">
                  {r.email} &middot; {r.role === 'faculty' ? 'Teacher' : 'Organization'} &middot;{' '}
                  {POSITION_LABELS[r.leadership_position] || r.leadership_position}
                </p>
              </div>
              <button
                onClick={() => handleApprove(r.id)}
                disabled={busyId === r.id}
                className="btn-primary text-sm px-3 py-1.5 disabled:opacity-50"
              >
                {busyId === r.id ? 'Approving...' : 'Approve Admin'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingAdminApprovals;
