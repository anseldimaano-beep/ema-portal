import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const formatUpdatedAt = (date) =>
  date.toLocaleString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

// Main "Home" panel of the student dashboard: classes table for the
// selected term, plus the balance summary. Falls back gracefully if the
// backend doesn't yet return grade/schedule/balance fields.
const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [balance, setBalance] = useState(null);
  const [term, setTerm] = useState('Current Term');
  const [updatedAt] = useState(new Date());

  useEffect(() => {
    api
      .get('/academics/courses/')
      .then((res) => setCourses(res.data.results || res.data || []))
      .catch(() => setCourses([]));

    api
      .get('/portal/balance/')
      .then((res) => setBalance(res.data))
      .catch(() => setBalance(null));
  }, []);

  return (
    <div className="flex-1 min-w-0 p-6 md:p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-1">Home</h1>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Show data for</span>
        <select
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="text-primary-700 font-medium bg-transparent border-none focus:outline-none focus:ring-0"
        >
          <option>Current Term</option>
          <option>Previous Term</option>
        </select>
      </div>

      <section className="rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="bg-primary-50 px-4 py-2 font-semibold text-gray-700 text-sm tracking-wide">
          CLASSES
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary-50/60 text-left text-gray-500">
              <th className="px-4 py-2 font-medium">Course</th>
              <th className="px-4 py-2 font-medium">Final</th>
              <th className="px-4 py-2 font-medium">Schedule</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-800">{course.title || course.name || course.code}</div>
                  {course.teacher_name && (
                    <div className="text-gray-400 text-xs">{course.teacher_name}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{course.final_grade ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{course.schedule_display || '—'}</td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                  No classes to show yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-4 py-2 text-right text-xs text-gray-400 bg-gray-50">
          Updated as of {formatUpdatedAt(updatedAt)}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-primary-50 px-4 py-2 font-semibold text-gray-700 text-sm tracking-wide">
          BALANCE
        </div>
        <div className="py-8 text-center">
          <p className="text-lg font-semibold text-gray-800">
            Outstanding Balance: {balance?.outstanding != null ? Number(balance.outstanding).toFixed(2) : '0.00'}
          </p>
          <p className="text-sm text-gray-500 mt-3">
            You can now view your Balance widget in the{' '}
            <Link to="/my-payments" className="text-primary-700 hover:underline">
              My Payments
            </Link>{' '}
            page.
          </p>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
