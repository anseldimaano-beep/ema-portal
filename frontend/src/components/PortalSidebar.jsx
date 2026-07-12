import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home as HomeIcon,
  User,
  Wrench,
  ChevronDown,
  DollarSign,
  LifeBuoy,
  LogOut,
} from 'lucide-react';
import logo from '../assets/logo.png';
import { COLLEGE_NAME, APP_VERSION } from '../utils/constants';

const NavItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
      active ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="h-4 w-4 shrink-0" />
    {label}
  </Link>
);

// Left navigation rail for the authenticated portal, modeled on the
// reference school-portal layout: seal + name, student number/GPA, then
// grouped nav (Home/Profile, Utilities, My Payments/Other Fees, Support).
const PortalSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [utilitiesOpen, setUtilitiesOpen] = useState(false);
  const [tipsOn, setTipsOn] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 flex items-center gap-3 border-b border-gray-200">
        <img src={logo} alt={`${COLLEGE_NAME} seal`} className="h-10 w-10 object-contain" />
        <span className="font-semibold text-gray-700 text-sm leading-tight">{COLLEGE_NAME}</span>
      </div>

      {user?.student_number && (
        <div className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
          <div>Student Number: {user.student_number}</div>
          {user?.gpa != null && <div>GPA: {user.gpa}</div>}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <NavItem to="/student-portal" icon={HomeIcon} label="Home" active={isActive('/student-portal')} />
        <NavItem to="/profile" icon={User} label="Profile" active={isActive('/profile')} />

        <div>
          <button
            onClick={() => setUtilitiesOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <span className="flex items-center gap-3">
              <Wrench className="h-4 w-4" /> Utilities
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${utilitiesOpen ? 'rotate-180' : ''}`} />
          </button>
          {utilitiesOpen && (
            <div className="ml-9 mt-1 space-y-1">
              <Link to="/ticket-requests" className="block px-2 py-1.5 text-sm text-gray-500 hover:text-primary-900">
                Ticket Requests
              </Link>
            </div>
          )}
        </div>

        <div className="pt-2 mt-2 border-t border-gray-200 text-xs font-semibold uppercase text-gray-400 px-4">
          Menu
        </div>
        <NavItem to="/my-payments" icon={DollarSign} label="My Payments" active={isActive('/my-payments')} />
        <NavItem to="/other-fees" icon={DollarSign} label="Other Fees" active={isActive('/other-fees')} />

        <div className="pt-2 mt-2 border-t border-gray-200 text-xs font-semibold uppercase text-gray-400 px-4">
          Support
        </div>
        <NavItem to="/contact" icon={LifeBuoy} label="Get Help" active={isActive('/contact')} />
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Enable Tips</span>
          <button
            onClick={() => setTipsOn((v) => !v)}
            className={`h-6 w-11 rounded-full transition-colors relative ${tipsOn ? 'bg-green-500' : 'bg-gray-300'}`}
            aria-pressed={tipsOn}
            aria-label="Enable Tips"
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                tipsOn ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-600 py-1"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
        <p className="text-xs text-gray-400 text-center">Version {APP_VERSION}</p>
      </div>
    </aside>
  );
};

export default PortalSidebar;
