import React from 'react';
import { useAuth } from '../context/AuthContext';
import PortalLogin from '../components/PortalLogin';
import PortalSidebar from '../components/PortalSidebar';

// Keeps sidebar links (Profile, My Payments, Other Fees, Ticket Requests)
// from 404ing while those pages are built out - same shell, "coming soon" body.
const PortalPlaceholder = ({ title }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PortalLogin />;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <PortalSidebar />
      <div className="flex-1 min-w-0 p-6 md:p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-500">This section is coming soon.</p>
      </div>
    </div>
  );
};

export default PortalPlaceholder;
