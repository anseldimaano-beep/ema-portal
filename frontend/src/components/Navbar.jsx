import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../utils/constants';
import { LogOut, User, ChevronDown } from 'lucide-react';
import logo from '../assets/logo.png';

// Public college-site navbar. College sections on the left, the
// student/faculty/admin portal grouped under a single "Portal Login"
// menu on the right (mirrors how real college sites separate the public
// site from the student information system).
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setPortalMenuOpen(false);
  };

  return (
    <nav className="bg-primary-900 text-white px-4 py-3 flex items-center justify-between relative border-b-4 border-accent-400">
      <Link to="/" className="flex items-center gap-3 font-bold text-lg shrink-0">
        <img src={logo} alt="College seal" className="h-10 w-10 object-contain" />
        <span>{APP_NAME}</span>
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm">
        <Link to="/about">About</Link>
        <Link to="/academics">Academics</Link>
        <Link to="/faculty">Faculty</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className="relative">
        <button
          onClick={() => setPortalMenuOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-semibold border border-white/40 rounded-md px-3 py-1.5 hover:bg-white/10"
        >
          {isAuthenticated ? (
            <>
              <User className="h-4 w-4" /> {user?.first_name || user?.username}
            </>
          ) : (
            'Portal Login'
          )}
          <ChevronDown className="h-4 w-4" />
        </button>

        {portalMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white text-gray-700 rounded-md shadow-lg py-2 text-sm z-10">
            {isAuthenticated ? (
              <>
                <Link to="/student-portal" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setPortalMenuOpen(false)}>
                  My Portal
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/student-portal" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setPortalMenuOpen(false)}>
                  Student Portal
                </Link>
                <Link to="/faculty-portal" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setPortalMenuOpen(false)}>
                  Faculty Portal
                </Link>
                <Link to="/admin-portal" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setPortalMenuOpen(false)}>
                  Admin Portal
                </Link>
                <div className="border-t border-gray-100 my-1" />
                <Link to="/register" className="block px-4 py-2 font-medium text-primary-900 hover:bg-gray-100" onClick={() => setPortalMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
