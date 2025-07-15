import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AddEditListing from './pages/AddEditListing';
import ListingDetails from './pages/ListingDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Favorites from './pages/Favorites';
import SellerProfile from './pages/SellerProfile';
import Notifications from './pages/Notifications';
import Feed from './pages/Feed';
import AdminDashboard from './pages/AdminDashboard';
import ColorShowcase from './components/ColorShowcase';
import MyMessages from './pages/MyMessages';
import Help from './pages/Help';
import ErrorBoundary from './components/ErrorBoundary';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import SafetyGuidelines from './pages/SafetyGuidelines';
import CommunityGuidelines from './pages/CommunityGuidelines';
import TrustStats from './pages/TrustStats';
import { ArrowUp } from 'lucide-react';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-fade-in">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddEditListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <AddEditListing />
            </ProtectedRoute>
          }
        />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile/:sellerId" element={<SellerProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/colors" element={<ColorShowcase />} />
        <Route path="/messages" element={<MyMessages />} />
        <Route path="/help" element={<Help />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
        <Route path="/community-guidelines" element={<CommunityGuidelines />} />
        <Route path="/trust-stats" element={<TrustStats />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const [showScroll, setShowScroll] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17] pt-32 transition-colors duration-500">
        <Router>
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </Router>
        {/* Fixed Scroll to Top Button */}
        {showScroll && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-[#3578e5] to-amber-400 text-white rounded-xl shadow-lg hover:scale-110 transition-all duration-300"
            aria-label="Scroll to top"
            tabIndex={0}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </ErrorBoundary>
  );
}