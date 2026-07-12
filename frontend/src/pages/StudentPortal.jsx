import React from 'react';
import { useAuth } from '../context/AuthContext';
import PortalLogin from '../components/PortalLogin';
import PortalSidebar from '../components/PortalSidebar';
import TasksPanel from '../components/TasksPanel';
import StudentDashboard from './StudentDashboard';

const StudentPortal = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PortalLogin />;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <PortalSidebar />
      <StudentDashboard />
      <TasksPanel />
    </div>
  );
};

export default StudentPortal;
