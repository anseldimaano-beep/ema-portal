import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../utils/constants';
import { LogOut, User } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary-900 text-white px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 font-bold text-lg">
        <img src={logo} alt="EMA EMITS College Philippines seal" className="h-10 w-10 object-contain" />
        <span>{APP_NAME}</span>
      </Link>
      <div className="flex items-center gap-6 text-sm">
        <Link to="/calendar">Calendar</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/student-portal">Student Portal</Link>
        <Link to="/faculty-portal">Faculty Portal</Link>
        <Link to="/admin-portal">Admin</Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" /> {user?.first_name || user?.username}
            </span>
            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-gray-300">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        ) : (
          <Link to="/register" className="font-medium hover:text-gray-300">
            Register
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
