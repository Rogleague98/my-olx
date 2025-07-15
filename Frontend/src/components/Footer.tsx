import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Shield, 
  Users, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowUp,
  Star,
  Award,
  Globe
} from 'lucide-react';

export default function Footer() {
  const [showScroll, setShowScroll] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17] animate-fade-in" role="contentinfo" aria-label="Site footer">
      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section */}
        <div className="">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#3578e5] to-amber-400 flex items-center justify-center shadow-lg">
                    <ShoppingBag className="w-7 h-7 text-white drop-shadow-md" aria-label="Marketplace logo" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">MarketPlace</h3>
                    <p className="text-sm text-white">Your trusted marketplace</p>
                  </div>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  Buy, sell, and discover amazing deals in your city. Join millions of users who trust MarketPlace for their buying and selling needs.
                </p>
                <div className="flex space-x-4" aria-label="Social media links">
                  <a href="#" className="p-2 rounded-xl hover:bg-amber-100/60 transition-all duration-300 hover:scale-110" aria-label="Facebook" tabIndex={0}>
                    <Facebook className="w-5 h-5 text-[#3578e5]" />
                  </a>
                  <a href="#" className="p-2 rounded-xl hover:bg-amber-100/60 transition-all duration-300 hover:scale-110" aria-label="Twitter" tabIndex={0}>
                    <Twitter className="w-5 h-5 text-[#3578e5]" />
                  </a>
                  <a href="#" className="p-2 rounded-xl hover:bg-amber-100/60 transition-all duration-300 hover:scale-110" aria-label="Instagram" tabIndex={0}>
                    <Instagram className="w-5 h-5 text-[#3578e5]" />
                  </a>
                  <a href="#" className="p-2 rounded-xl hover:bg-amber-100/60 transition-all duration-300 hover:scale-110" aria-label="LinkedIn" tabIndex={0}>
                    <Linkedin className="w-5 h-5 text-[#3578e5]" />
                  </a>
                </div>
              </div>
              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-400" />
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-white hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-[#3578e5] rounded-full transition-colors"></span>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/feed" className="text-white hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-[#3578e5] rounded-full transition-colors"></span>
                      Browse Listings
                    </Link>
                  </li>
                  <li>
                    <Link to="/add" className="text-white hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-[#3578e5] rounded-full transition-colors"></span>
                      Sell an Item
                    </Link>
                  </li>
                  <li>
                    <Link to="/favorites" className="text-white hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-[#3578e5] rounded-full transition-colors"></span>
                      Favorites
                    </Link>
                  </li>
                  <li>
                    <Link to="/help" className="text-white hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-[#3578e5] rounded-full transition-colors"></span>
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/trust-stats" className="text-white hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-[#3578e5] rounded-full transition-colors"></span>
                      Trust & Stats
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Support */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  Support
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href="mailto:support@marketplace.com" className="text-white hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                      <Mail className="w-4 h-4 text-[#3578e5]" />
                      support@marketplace.com
                    </a>
                  </li>
                  <li>
                    <a href="tel:+1234567890" className="text-white hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                      <Phone className="w-4 h-4 text-[#3578e5]" />
                      +1 (234) 567-890
                    </a>
                  </li>
                  <li>
                    <div className="text-white flex items-center gap-2 group">
                      <MapPin className="w-4 h-4 text-[#3578e5]" />
                      <span>123 Market St, City, State 12345</span>
                    </div>
                  </li>
                  <li>
                    <Link to="/safety-guidelines" className="text-white hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                      <Shield className="w-4 h-4 text-[#3578e5]" />
                      Safety Guidelines
                    </Link>
                  </li>
                  <li>
                    <Link to="/community-guidelines" className="text-white hover:text-amber-500 transition-colors duration-200 flex items-center gap-2 group">
                      <Users className="w-4 h-4 text-[#3578e5]" />
                      Community Guidelines
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Stats & Trust */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Trust & Stats
                </h4>
                <div className="space-y-4">
                  <div className="bg-white/30 rounded-2xl p-4 border border-[#4f8cff]/30 shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-amber-400 fill-current" />
                      <span className="font-semibold text-white">4.8/5</span>
                    </div>
                    <p className="text-sm text-white">Average Rating</p>
                  </div>
                  <div className="bg-white/30 rounded-2xl p-4 border border-[#4f8cff]/30 shadow-md">
                    <div className="text-2xl font-bold text-white mb-1">2M+</div>
                    <p className="text-sm text-white">Active Users</p>
                  </div>
                  <div className="bg-white/30 rounded-2xl p-4 border border-[#4f8cff]/30 shadow-md">
                    <div className="text-2xl font-bold text-white mb-1">500K+</div>
                    <p className="text-sm text-white">Successful Sales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Section - Legal only, no background or border */}
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-lg text-white">
              <span>&copy; {currentYear} MarketPlace. All rights reserved.</span>
              <div className="flex items-center space-x-4" aria-label="Legal links">
                <Link to="/privacy-policy" className="text-white hover:text-amber-500 transition-colors">Privacy Policy</Link>
                <Link to="/terms-of-service" className="text-white hover:text-amber-500 transition-colors">Terms of Service</Link>
                <Link to="/cookie-policy" className="text-white hover:text-amber-500 transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </footer>
  );
} 