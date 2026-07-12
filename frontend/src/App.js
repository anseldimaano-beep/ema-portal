import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import StudentPortal from './pages/StudentPortal';
import FacultyPortal from './pages/FacultyPortal';
import AdminPortal from './pages/AdminPortal';
import CalendarPage from './pages/CalendarPage';
import FAQPage from './pages/FAQPage';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/student-portal" element={<StudentPortal />} />
            <Route path="/faculty-portal" element={<FacultyPortal />} />
            <Route path="/admin-portal" element={<AdminPortal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
