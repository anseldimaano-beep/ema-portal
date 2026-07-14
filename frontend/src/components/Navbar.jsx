import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import logo from '../assets/logo.png';
import eemgSeal from '../assets/eemg_seal.png';
import { SESSION_LABEL, SESSION_SUBLABEL } from '../utils/constants';

// Public college-site navbar, styled after the Senate of the Philippines
// header: a red masthead with the seal + wordmark and a session badge, then
// a lighter nav row underneath with dropdown groups.
const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  {
    label: 'About',
    to: '/about',
    children: [
      { label: 'College History', to: '/about#college' },
      { label: 'EEMG History', to: '/about#eemg' }
    ]
  },
  { label: 'Project', to: '/project' },
  {
    label: 'Government',
    to: '/government',
    children: [
      { label: 'Senators', to: '/government#senators' },
      { label: 'Committees', to: '/government#committees' }
    ]
  },
  { label: 'Calendar', to: '/calendar' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' }
];

const NavDropdown = ({ item }) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  const openNow = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        className="flex items-center gap-1 py-4 text-sm font-semibold text-gray-700 hover:text-primary-800 transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute left-0 top-full w-56 bg-white rounded-md shadow-lg border border-gray-100 py-2 z-30">
          {item.children.map((child) => (
            <Link
              key={child.label}
              to={child.to}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile menu whenever the viewport grows back to desktop size.
  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setMobileOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      {/* Masthead */}
      <div className="bg-primary-900 text-white border-b-4 border-accent-400">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="College seal" className="h-11 w-11 object-contain shrink-0" />
            <img src={eemgSeal} alt="EMA EMITS Model Government seal" className="h-11 w-11 object-contain shrink-0" />
            <span className="brand-title text-lg sm:text-2xl font-semibold leading-tight truncate">
              EMA EMITS Model Government
            </span>
          </Link>

          <div className="hidden sm:flex flex-col items-end shrink-0 rounded-md bg-white/10 px-4 py-1.5 border border-white/20">
            <span className="text-sm font-bold leading-tight">{SESSION_LABEL}</span>
            <span className="text-[10px] tracking-[0.15em] text-primary-100 leading-tight">{SESSION_SUBLABEL}</span>
          </div>

          <button
            className="sm:hidden p-2 -mr-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Nav row */}
      <nav className="hidden md:block bg-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <NavDropdown key={item.label} item={item} />
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `py-4 text-sm font-semibold border-b-2 transition-colors ${
                      isActive
                        ? 'text-primary-800 border-primary-800'
                        : 'text-gray-700 border-transparent hover:text-primary-800'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>
          <button aria-label="Search" className="p-2 text-gray-500 hover:text-primary-800 transition-colors">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-4 py-2">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              <Link
                to={item.to}
                className="block py-3 text-sm font-semibold text-gray-700 border-b border-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.label}
                  to={child.to}
                  className="block py-2 pl-4 text-sm text-gray-500 border-b border-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;