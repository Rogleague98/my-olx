import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, Button, Card, LoadingSpinner, Container } from '../components/ui';
import { categories } from '../constants';
import { Search, Filter, MapPin, DollarSign, SortAsc, Grid, List, Sliders } from 'lucide-react';

const sortOptions = [
  { value: 'newest', label: 'Newest First', icon: '🆕' },
  { value: 'price_asc', label: 'Price: Low to High', icon: '💰' },
  { value: 'price_desc', label: 'Price: High to Low', icon: '💎' },
  { value: 'promoted', label: 'Promoted', icon: '⭐' },
];

export default function Feed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    subcategory: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });
  const [subcategories, setSubcategories] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category') || '';
    const subcategory = params.get('subcategory') || '';
    setFilters(f => ({ ...f, category, subcategory }));
  }, [location.search]);

  useEffect(() => {
    if (filters.category) {
      const cat = categories.find(c => c.name === filters.category);
      setSubcategories(cat?.subcategories || []);
    } else {
      setSubcategories([]);
    }
  }, [filters.category]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    
    fetch(`/api/listings?${params.toString()}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch listings');
        }
        return res.json();
      })
      .then(data => {
        console.log('=== API listings response:', data, '===');
        setListings(data);
      })
      .catch(err => {
        console.error('Error fetching listings:', err);
        setError(err.message || 'Failed to load listings');
        setListings([]);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  if (!user) {
    return (
      <Container className="py-16">
        <Card variant="elevated" className="text-center py-16 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Search className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-4">Your Personalized Feed</h2>
          <p className="text-primary-600 mb-8 max-w-md mx-auto">
            Log in to see new listings from sellers you follow and get personalized recommendations.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="solid"
              color="primary"
              onClick={() => navigate('/login')}
              className="shadow-lg hover:shadow-xl"
            >
              Login to Continue
            </Button>
            <Button
              variant="outline"
              color="primary"
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  // Debug: Log filters and listings data before rendering
  console.log('Feed filters:', filters);
  console.log('Feed listings:', listings);
  console.log('=== Listings array length:', listings.length, '===');
  console.log('=== Listings array:', listings, '===');
  console.log('=== Feed initial listings state:', listings, '===');
  console.log('=== Feed listings before render:', listings, '===');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        <Container className="py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#FFD700] bg-clip-text text-transparent mb-2">Discover Amazing Deals</h1>
            <p className="text-white text-lg">Find what you're looking for in our marketplace</p>
          </div>

          {/* Sticky Filter Bar */}
          <div className="sticky top-24 z-30 mb-8">
            <Card variant="elevated" className="p-6 animate-fade-in">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="relative flex-1 w-full lg:w-auto">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                  <Input
                    placeholder="Search for anything..."
                    value={filters.q}
                    onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
                    className="pl-12 bg-white/20 backdrop-blur-md text-white placeholder-white"
                  />
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={filters.category}
                    onChange={e => setFilters(f => ({ ...f, category: e.target.value, subcategory: '' }))}
                    className="px-4 py-2 rounded-none border border-white/30 bg-white/20 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>

                  <select
                    value={filters.sort}
                    onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
                    className="px-4 py-2 rounded-none border border-white/30 bg-white/20 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                    ))}
                  </select>

                  <Button
                    variant="outline"
                    color="primary"
                    icon={Sliders}
                    onClick={() => setShowFilters(!showFilters)}
                    className="hover:bg-white/20 text-white border-white"
                  >
                    Filters
                  </Button>

                  <div className="flex bg-white/20 rounded-none p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-none transition-all duration-300 ${
                        viewMode === 'grid' 
                          ? 'bg-white/30 text-white shadow-lg' 
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      <Grid className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-none transition-all duration-300 ${
                        viewMode === 'list' 
                          ? 'bg-white/30 text-white shadow-lg' 
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      <List className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-white/30 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
                      <Input
                        type="text"
                        placeholder="Location"
                        value={filters.location}
                        onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
                        className="pl-10 bg-white/20 backdrop-blur-md text-white placeholder-white"
                      />
                    </div>

                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
                      <Input
                        type="number"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                        className="pl-10 bg-white/20 backdrop-blur-md text-white placeholder-white"
                      />
                    </div>

                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
                      <Input
                        type="number"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                        className="pl-10 bg-white/20 backdrop-blur-md text-white placeholder-white"
                      />
                    </div>

                    <select
                      value={filters.subcategory}
                      onChange={e => setFilters(f => ({ ...f, subcategory: e.target.value }))}
                      className="px-4 py-3 rounded-xl border border-white/30 bg-white/20 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
                      disabled={!filters.category}
                    >
                      <option value="">All Subcategories</option>
                      {subcategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 mt-4 justify-end">
                    <Button
                      variant="outline"
                      color="primary"
                      onClick={() => {
                        setFilters({
                          q: '',
                          category: '',
                          subcategory: '',
                          location: '',
                          minPrice: '',
                          maxPrice: '',
                          sort: 'newest',
                        });
                      }}
                    >
                      Clear All
                    </Button>
                    <Button
                      variant="solid"
                      color="primary"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Results */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-700">
                {listings.length} {listings.length === 1 ? 'listing' : 'listings'} found
              </h2>
              {filters.category && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                  Category: {filters.category}
                </span>
              )}
            </div>

            {error && (
              <Card variant="elevated" className="text-center py-8 animate-fade-in mb-6">
                <div className="text-red-600 mb-4">
                  <p className="font-semibold">Error loading listings</p>
                  <p className="text-sm">{error}</p>
                </div>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </Card>
            )}

            {loading ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner size="lg" text="Loading listings..." />
              </div>
            ) : listings.length === 0 && !error ? (
              <Card variant="elevated" className="text-center py-16 animate-fade-in">
                <div className="w-32 h-32 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Search className="w-16 h-16 text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold text-primary-700 mb-2">No listings found</h3>
                <p className="text-primary-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search criteria or browse all categories to find what you're looking for.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    color="primary"
                    onClick={() => {
                      setFilters({
                        q: '',
                        category: '',
                        subcategory: '',
                        location: '',
                        minPrice: '',
                        maxPrice: '',
                        sort: 'newest',
                      });
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    variant="solid"
                    color="primary"
                    onClick={() => navigate('/add')}
                  >
                    Sell Something
                  </Button>
                </div>
              </Card>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
              }>
                {listings.map((listing, index) => {
                  console.log('=== Listing in map:', listing, '===');
                  console.log('Array.isArray(listing.images):', Array.isArray(listing.images), 'listing.images:', listing.images);
                  const cardProps = {
                    id: listing.id || listing._id,
                    title: listing.title,
                    price: listing.price?.toString() || '0',
                    image: Array.isArray(listing.images) && listing.images.length > 0 ? listing.images[0] : undefined,
                    location: listing.location,
                    category: listing.category,
                    subcategory: listing.subcategory,
                    viewMode: viewMode,
                  };
                  console.log('ListingCard props:', cardProps);
                  return (
                    <div
                      key={listing.id || listing._id || index}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ListingCard {...cardProps} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
} 