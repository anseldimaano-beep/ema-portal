import React from 'react';
import { useAuth } from '../context/AuthContext';
import PortalLogin from '../components/PortalLogin';
import AdminPanel from '../components/AdminPanel';
import PendingAdminApprovals from '../components/PendingAdminApprovals';

const AdminPortal = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <PortalLogin />;
  if (user?.role !== 'admin') return <div className="p-16 text-center">Access Denied</div>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin Portal</h1>
      <PendingAdminApprovals />
      <AdminPanel />
    </div>
  );
};

export default AdminPortal;
