import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PortalPlaceholder from './pages/PortalPlaceholder';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import ProgramDetail from './pages/ProgramDetail';
import Faculty from './pages/Faculty';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import StudentPortal from './pages/StudentPortal';
import FacultyPortal from './pages/FacultyPortal';
import AdminPortal from './pages/AdminPortal';
import CalendarPage from './pages/CalendarPage';
import FAQPage from './pages/FAQPage';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// The dashboard/login screens render their own full-page sidebar layout,
// so the public marketing navbar is hidden on those routes.
const PORTAL_ROUTES = ['/student-portal', '/faculty-portal', '/admin-portal', '/profile', '/my-payments', '/other-fees', '/ticket-requests'];

const Layout = () => {
  const location = useLocation();
  const hideNavbar = PORTAL_ROUTES.some((route) => location.pathname.startsWith(route));

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/academics/:slug" element={<ProgramDetail />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/student-portal" element={<StudentPortal />} />
        <Route path="/faculty-portal" element={<FacultyPortal />} />
        <Route path="/admin-portal" element={<AdminPortal />} />
        <Route path="/profile" element={<PortalPlaceholder title="Profile" />} />
        <Route path="/my-payments" element={<PortalPlaceholder title="My Payments" />} />
        <Route path="/other-fees" element={<PortalPlaceholder title="Other Fees" />} />
        <Route path="/ticket-requests" element={<PortalPlaceholder title="Ticket Requests" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
