import React from 'react';
import { Search } from 'lucide-react';

export default function HeroSection({
  title = 'Welcome to OLX Futurist',
  subtitle = 'Buy, sell, and discover amazing deals in your city!',
  ctaText = 'Start Exploring',
  onCtaClick,
  showSearch = false,
  onSearch,
}: {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}) {
  const [search, setSearch] = React.useState('');
  
  return (
    <section className="w-full flex flex-col items-center justify-center py-20 px-4 mb-12 bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17] rounded-3xl shadow-2xl backdrop-blur-xl animate-fade-in border border-blue-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 text-center max-w-4xl">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gradient mb-6 drop-shadow-lg leading-tight text-white">
          {title}
        </h1>
        <p className="text-xl sm:text-2xl text-primary-700 mb-8 text-center max-w-3xl leading-relaxed text-white">
          {subtitle}
        </p>
        
        {showSearch && (
          <form
            className="flex items-center gap-3 mb-8 w-full max-w-2xl mx-auto"
            onSubmit={e => {
              e.preventDefault();
              if (onSearch) onSearch(search);
            }}
          >
            <div className="relative flex-1">
              <input
                className="w-full px-6 py-4 rounded-2xl border-2 border-white/30 bg-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg placeholder:text-primary-400 transition-all duration-300 text-white"
                placeholder="Search listings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary-400 w-6 h-6 text-white" />
            </div>
            <button
              type="submit"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 hover:from-secondary-500 hover:to-primary-500 transition-all duration-300 transform"
            >
              Search
            </button>
          </form>
        )}
        
        <button
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-110 hover:from-secondary-500 hover:to-primary-500 transition-all duration-300 transform animate-pulse-glow"
          onClick={onCtaClick}
        >
          {ctaText}
        </button>
      </div>
    </section>
  );
} 