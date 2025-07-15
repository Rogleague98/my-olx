import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingContext';
import ListingCard, { SkeletonCard } from '../components/ListingCard';
import { useNavigate } from 'react-router-dom';
import { getFavorites } from '../api/user';
import { Container, Card, Button, LoadingSpinner } from '../components/ui';
import { Heart, LogIn, Sparkles, Search, Filter, Grid, List } from 'lucide-react';

function FavoritesSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        {/* Header skeleton */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 animate-pulse" />
          <div className="h-8 w-1/2 bg-white/20 rounded mx-auto mb-3 animate-pulse" />
          <div className="h-5 w-1/3 bg-white/10 rounded mx-auto mb-2 animate-pulse" />
        </div>
        {/* Search/filter bar skeleton */}
        <div className="mb-6 animate-fade-in">
          <div className="h-10 w-full bg-white/10 rounded animate-pulse" />
        </div>
        {/* Favorite cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-white/10 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Favorites() {
  const { user } = useAuth();
  const { listings } = useListings();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const favorites = await getFavorites();
        setFavoriteIds(favorites);
        // Also update localStorage for consistency
        localStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to load favorites:', error);
        // Fallback to localStorage
        const favs = localStorage.getItem('favorites');
        setFavoriteIds(favs ? JSON.parse(favs) : []);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const favoriteListings = listings.filter(l => favoriteIds.includes(l.id));
  
  // Filter favorites based on search term
  const filteredFavorites = favoriteListings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
        <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
          <Container size="sm" animate>
            <Card variant="elevated" className="text-center py-16 animate-scale-in relative overflow-hidden">
              {/* Card background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse-glow">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4 text-gradient">Your Favorites</h2>
                <p className="text-primary-600 mb-8 text-lg">Please log in to save and view your favorite listings.</p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-accent-500" />
                  <span className="text-sm text-primary-500 font-medium">Save items you love</span>
                  <Sparkles className="w-5 h-5 text-accent-500" />
                </div>
                <Button 
                  icon={LogIn}
                  onClick={() => navigate('/login')}
                  size="lg"
                  variant="solid"
                  color="primary"
                  className="shadow-xl hover:shadow-2xl"
                >
                  Login to Continue
                </Button>
              </div>
            </Card>
          </Container>
        </div>
      </div>
    );
  }

  if (loading) {
    return <FavoritesSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        <Container className="py-8">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse-glow">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-3">Your Favorites</h1>
            <p className="text-primary-600 text-lg">All the listings you've saved for later</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Sparkles className="w-5 h-5 text-accent-500" />
              <span className="text-sm text-primary-500 font-medium">{favoriteListings.length} saved items</span>
              <Sparkles className="w-5 h-5 text-accent-500" />
            </div>
          </div>

          {/* Search and Filter Bar */}
          {favoriteListings.length > 0 && (
            <Card variant="elevated" className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
                  <input
                    type="text"
                    placeholder="Search your favorites..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 placeholder:text-primary-400"
                  />
                </div>
                
                <div className="flex bg-white/20 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-white/30 text-primary-700 shadow-lg' 
                        : 'text-primary-600 hover:bg-white/20'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-white/30 text-primary-700 shadow-lg' 
                        : 'text-primary-600 hover:bg-white/20'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          )}
          
          {/* Favorites Grid/List */}
          {favoriteListings.length === 0 ? (
            <Card variant="elevated" className="text-center py-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-32 h-32 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-16 h-16 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-primary-700 mb-2">No favorites yet</h3>
              <p className="text-primary-600 mb-6 text-lg">Click the heart icon on any listing to save it to your favorites!</p>
              <Button 
                icon={Heart}
                onClick={() => navigate('/')}
                variant="solid"
                color="primary"
                className="shadow-xl hover:shadow-2xl"
              >
                Browse Listings
              </Button>
            </Card>
          ) : filteredFavorites.length === 0 ? (
            <Card variant="elevated" className="text-center py-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-32 h-32 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Search className="w-16 h-16 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-primary-700 mb-2">No matching favorites</h3>
              <p className="text-primary-600 mb-6">Try adjusting your search criteria</p>
              <Button 
                variant="outline"
                color="primary"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            </Card>
          ) : (
            <div className={`animate-fade-in ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }`} style={{ animationDelay: '0.2s' }}>
              {filteredFavorites.map((listing, index) => (
                <div 
                  key={listing.id} 
                  className="animate-fade-in" 
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  <ListingCard
                    id={listing.id}
                    title={listing.title}
                    price={listing.price.toString()}
                    image={listing.images && listing.images.length > 0 ? listing.images[0] : undefined}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
} 