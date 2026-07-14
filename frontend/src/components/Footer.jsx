import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Mail, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';
import eemgSeal from '../assets/eemg_seal.png';
import { COLLEGE_NAME, COLLEGE_FACEBOOK_URL } from '../utils/constants';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Project', to: '/project' },
  { label: 'Government', to: '/government' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' }
];

const Footer = () => (
  <footer className="bg-primary-900 text-primary-100 border-t-4 border-accent-400">
    <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {/* Brand */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <img src={logo} alt="College seal" className="h-10 w-10 object-contain" />
          <img src={eemgSeal} alt="EMG seal" className="h-10 w-10 object-contain" />
        </div>
        <p className="brand-title text-white text-sm font-semibold leading-snug">
          EMA EMITS Model Government
        </p>
        <p className="text-xs text-primary-300 mt-2 leading-relaxed">
          The student-run legislative body of {COLLEGE_NAME}.
        </p>
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-white text-sm font-bold uppercase tracking-wide mb-3">Quick Links</h3>
        <ul className="space-y-2 text-sm">
          {QUICK_LINKS.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="text-primary-200 hover:text-white transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-white text-sm font-bold uppercase tracking-wide mb-3">Contact</h3>
        <ul className="space-y-2 text-sm text-primary-200">
          <li className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Pinamalayan, Oriental Mindoro, Philippines</span>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0" />
            <span>info@emaemits.edu.ph</span>
          </li>
        </ul>
      </div>

      {/* Social */}
      <div>
        <h3 className="text-white text-sm font-bold uppercase tracking-wide mb-3">Follow Us</h3>
        <a
          href={COLLEGE_FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary-200 hover:text-white transition-colors"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </a>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-primary-300 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>&copy; {new Date().getFullYear()} EMA EMITS Model Government. All rights reserved.</span>
        <span>S.Y. 2026-2027 · 1st Term</span>
      </div>
    </div>
  </footer>
);

export default Footer;