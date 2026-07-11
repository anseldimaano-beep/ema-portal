import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { APP_NAME } from '../utils/constants';
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
      <div className="bg-primary-900 text-white py-20 px-4 text-center">
        <img src={logo} alt="EMA EMITS College Philippines seal" className="h-32 w-32 object-contain mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">{APP_NAME}</h1>
        <p className="text-lg text-primary-100 mb-8">
          Everything you need for enrollment, academics, and campus life in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/student-portal" className="btn-primary bg-white text-primary-900 hover:bg-gray-100">
            Student Portal
          </Link>
          <Link to="/faculty-portal" className="btn-primary bg-primary-700 hover:bg-primary-600">
            Faculty Portal
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Announcements</h2>
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
  );
};

export default Home;
