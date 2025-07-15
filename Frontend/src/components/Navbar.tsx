import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Plus, Heart, Bell, MessageCircle, ShieldCheck, User, Search, MapPin, Filter, ShoppingBag } from 'lucide-react';
import { bulgarianCities, categories } from '../constants';
import { Button } from './ui';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Search/filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Responsive: sticky bottom nav on mobile
  const navItems = [
    { label: 'Home', icon: Home, to: '/' },
    { label: 'Sell', icon: Plus, to: '/add' },
    { label: 'Favorites', icon: Heart, to: '/favorites' },
    { label: 'Notifications', icon: Bell, to: '/notifications' },
    { label: 'Messages', icon: MessageCircle, to: '/messages' },
    { label: 'Help', icon: ShieldCheck, to: '/help' },
    { label: 'Profile', icon: User, to: '/profile' },
  ];

  // Handlers (add your own logic for search/filter actions)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Example: navigate(`/feed?search=${searchTerm}&city=${cityFilter}&category=${category}&subcategory=${subcategory}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col bg-transparent animate-fade-in py-2" style={{backdropFilter: 'blur(16px)'}}>
      {/* Top Row: Logo + Navigation in a glassy outlined box */}
      <div className="w-full flex justify-center">
        <div className="max-w-7xl w-full mx-auto">
          <div className="flex flex-row items-center gap-4 px-6 py-2 bg-[#181c23]/80 border border-blue-700 rounded-[2rem] shadow-xl">
            {/* Marketplace Logo (left) */}
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-transparent shadow transition-all duration-300 hover:shadow-blue-400/60 hover:scale-105 group"
              aria-label="Go to homepage"
              tabIndex={0}
            >
              <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center shadow-md group-hover:shadow-blue-400/80 transition-all duration-300">
                <ShoppingBag className="w-5 h-5 text-white group-hover:text-amber-400 transition-colors duration-300" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-wide group-hover:text-amber-500 transition-colors duration-300 drop-shadow-lg">MarketPlace</span>
            </Link>
            {/* Navigation Bar (right of logo) */}
            <nav
              className="flex flex-row items-center gap-x-4 ml-4"
              aria-label="Main navigation"
            >
              {user ? (
                <>
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to;
                    return (
                      <Link
                        key={item.label}
                        to={item.to}
                        className={`flex flex-row items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${isActive ? '' : ''}`}
                        style={{ minWidth: 48 }}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon className={`w-5 h-5 transition-all duration-300 drop-shadow-md ${isActive ? 'text-white group-hover:text-amber-400 animate-pulse' : 'text-white group-hover:text-amber-400 group-hover:scale-110 group-hover:shadow-lg'}`} />
                        <span className={`text-sm font-bold tracking-wide transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-[#3578e5] to-amber-400 bg-clip-text text-transparent underline underline-offset-8 drop-shadow-lg' : 'text-white group-hover:text-amber-500 group-hover:scale-105 group-hover:shadow-md'}`} style={{letterSpacing: '0.02em'}}>{item.label}</span>
                        {isActive && <span className="block w-5 h-1 rounded-full bg-gradient-to-r from-[#3578e5] to-amber-400 mt-1 shadow-md animate-pulse" />}
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="flex flex-row items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 text-white hover:text-amber-500 hover:scale-105 hover:shadow-md"
                    style={{ minWidth: 48 }}
                    aria-label="Logout"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 17l5-5m0 0l-5-5m5 5H9m-4 5v-1a4 4 0 014-4h1"/></svg>
                    <span className="text-sm font-bold tracking-wide">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex flex-row items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 text-white hover:text-amber-500 hover:scale-105 hover:shadow-md"
                    style={{ minWidth: 48 }}
                  >
                    <span className="text-sm font-bold tracking-wide">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex flex-row items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 text-white hover:text-amber-500 hover:scale-105 hover:shadow-md"
                    style={{ minWidth: 48 }}
                  >
                    <span className="text-sm font-bold tracking-wide">Register</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
      {/* Bottom Row: Search/Filter Bar */}
      <form onSubmit={handleSearch} className="w-full flex justify-center mt-2 animate-fade-in">
        <div className="flex flex-row items-center justify-center gap-x-2 w-full max-w-4xl px-2">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative bg-[#181c23]/80 border border-blue-700 rounded-full shadow flex items-center px-3 py-2 transition-all duration-300 hover:shadow-blue-400/60 focus-within:shadow-blue-400/80 hover:-translate-y-1 focus-within:-translate-y-1">
              <Search className="w-4 h-4 text-white mr-2 transition-colors duration-300 group-hover:text-amber-400" />
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-blue-300 focus:placeholder:text-blue-400 transition-colors duration-300"
              />
            </div>
          </div>
          {/* City */}
          <div className="flex-1 min-w-0">
            <div className="relative bg-[#181c23]/80 border border-blue-700 rounded-full shadow flex items-center px-3 py-2 transition-all duration-300 hover:shadow-blue-400/60 focus-within:shadow-blue-400/80 hover:-translate-y-1 focus-within:-translate-y-1">
              <MapPin className="w-4 h-4 text-white mr-2 transition-colors duration-300 group-hover:text-amber-400" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-blue-300 focus:placeholder:text-blue-400 transition-colors duration-300"
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                list="city-list"
                placeholder="City..."
                autoComplete="off"
              />
              <datalist id="city-list">
                {bulgarianCities.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
          </div>
          {/* Category */}
          <div className="flex-1 min-w-0">
            <div className="relative bg-[#181c23]/80 border border-blue-700 rounded-full shadow flex items-center px-3 py-2 transition-all duration-300 hover:shadow-blue-400/60 focus-within:shadow-blue-400/80 hover:-translate-y-1 focus-within:-translate-y-1">
              <select
                className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-blue-300 focus:placeholder:text-blue-400 transition-colors duration-300"
                value={category}
                onChange={e => {
                  setCategory(e.target.value);
                  setSubcategory('');
                }}
              >
                <option value="">Category...</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Subcategory */}
          <div className="flex-1 min-w-0">
            <div className="relative bg-[#181c23]/80 border border-blue-700 rounded-full shadow flex items-center px-3 py-2 transition-all duration-300 hover:shadow-blue-400/60 focus-within:shadow-blue-400/80 hover:-translate-y-1 focus-within:-translate-y-1">
              <select
                className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-blue-300 focus:placeholder:text-blue-400 transition-colors duration-300"
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                disabled={!category}
              >
                <option value="">{category ? 'Subcategory...' : 'Select category first'}</option>
                {category && categories.find(cat => cat.name === category)?.subcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Filters Button */}
          <div>
            <button
              type="submit"
              className="px-4 py-2 rounded-full font-bold shadow hover:scale-110 hover:shadow-blue-400/60 transition-all duration-300 flex items-center gap-2 border-2 bg-[#181c23]/80 border-blue-700 text-white hover:text-amber-400 focus:ring-2 focus:ring-amber-300 relative overflow-hidden"
            >
              <span className="absolute inset-0 rounded-full pointer-events-none group-hover:shadow-[0_0_24px_4px_rgba(255,193,7,0.12)] transition-all duration-300" />
              <Filter className="w-4 h-4 text-transparent bg-gradient-to-r from-[#3578e5] to-amber-400 bg-clip-text animate-pulse" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </form>
    </header>
  );
} 