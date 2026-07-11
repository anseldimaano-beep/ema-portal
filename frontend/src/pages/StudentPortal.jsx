import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import Profile from '../components/Profile';
import EnrollmentStatus from '../components/EnrollmentStatus';
import CourseCard from '../components/CourseCard';
import api from '../services/api';

const StudentPortal = () => {
  const { isAuthenticated, user } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get('/academics/courses/')
      .then((res) => setCourses(res.data.results || res.data || []))
      .catch(() => setCourses([]));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Welcome, {user?.first_name || user?.username}
      </h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Profile />
        <EnrollmentStatus />
      </div>
      <h2 className="text-xl font-bold mb-4">Available Courses</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        {courses.length === 0 && <p className="text-gray-500">No courses to show yet.</p>}
      </div>
    </div>
  );
};

export default StudentPortal;
