import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import eemgSeal from '../assets/eemg_seal.png';

// Public college-site navbar. No portal/login system - just the
// informational pages.
const Navbar = () => (
  <nav className="bg-primary-900 text-white px-4 py-3 flex items-center justify-between relative border-b-4 border-accent-400">
    <Link to="/" className="flex items-center gap-3 font-bold text-lg shrink-0">
      <img src={logo} alt="College seal" className="h-10 w-10 object-contain" />
      <img src={eemgSeal} alt="EMA EMITS Model Government seal" className="h-10 w-10 object-contain" />
      <span>EMA EMITS MODEL GOVERNMENT</span>
    </Link>

    <div className="hidden md:flex items-center gap-6 text-sm">
      <Link to="/about">About</Link>
      <Link to="/government">Government</Link>
      <Link to="/calendar">Calendar</Link>
      <Link to="/faq">FAQ</Link>
      <Link to="/contact">Contact</Link>
    </div>
  </nav>
);

export default Navbar;
