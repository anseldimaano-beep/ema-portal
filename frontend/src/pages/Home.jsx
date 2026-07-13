import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { APP_NAME, COLLEGE_NAME } from '../utils/constants';
import logo from '../assets/logo.png';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api
      .get('/portal/announcements/')
      .then((res) => setAnnouncements(res.data.results || res.data || []))
      .catch(() => setAnnouncements([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="bg-primary-900 text-white py-16 px-4 text-center">
        <img src={logo} alt={`${COLLEGE_NAME} seal`} className="h-28 w-28 object-contain mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-3">{COLLEGE_NAME}</h1>
        <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
          {APP_NAME} — everything you need for admissions and campus life in one place.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact" className="btn-primary bg-white text-primary-900 hover:bg-gray-100">
            Get in Touch
          </Link>
        </div>
      </div>

      {/* Announcements / news */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-6">News &amp; Announcements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {announcements.map((a) => (
              <div key={a.id} className="card">
                <h3 className="font-bold">{a.title}</h3>
                <p className="text-gray-600 mt-2">{a.excerpt || a.content}</p>
              </div>
            ))}
            {announcements.length === 0 && (
              <p className="text-gray-500">No announcements right now.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
