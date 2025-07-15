import React, { useState, useEffect } from 'react';
import { useListings } from '../context/ListingContext';
import ListingCard, { SkeletonCard } from '../components/ListingCard';
import { bulgarianCities, categories as allCategories } from '../constants';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { Container, Card, Button, Input } from '../components/ui';
import { MapPin, Search, Filter, Star, TrendingUp, Sparkles } from 'lucide-react';
import CategoryMenu from '../components/CategoryMenu';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { listings } = useListings();
  const [showFeaturedConsent, setShowFeaturedConsent] = useState(false);
  const [showFeatured, setShowFeatured] = useState(true);
  const navigate = useNavigate();
console.log(listings);
  useEffect(() => {
    const consent = localStorage.getItem('showFeaturedListings');
    if (consent === null) {
      setShowFeaturedConsent(true);
      setShowFeatured(false);
    } else {
      setShowFeatured(consent === 'true');
    }
  }, []);

  const handleFeaturedConsent = (agree: boolean) => {
    localStorage.setItem('showFeaturedListings', agree ? 'true' : 'false');
    setShowFeatured(agree);
    setShowFeaturedConsent(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17] my-32">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
      <Container className="py-8">
        {/* Hero Section */}
          <Card
            variant="glass"
            className="text-center mb-12 py-10 animate-fade-in border-[#4f8cff]"
            aria-label="Hero section"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#FFD700] bg-clip-text text-transparent mb-4 drop-shadow-lg">
            Welcome to <span className="text-[#FFD700]">MarketPlace</span>
          </h1>
            <p className="text-2xl text-white mb-8 max-w-2xl mx-auto">
            Discover amazing deals, sell your items, and connect with buyers in your community
          </p>
          </Card>

        {/* Featured Consent */}
        {showFeaturedConsent && (
          <Card variant="elevated" className="mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white flex items-center justify-center">
                    <Star className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">Show Featured Listings?</h3>
                    <p className="text-sm text-white">Get personalized recommendations and featured deals</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="solid"
                  color="primary"
                  onClick={() => handleFeaturedConsent(true)}
                >
                  Yes, Show Featured
                </Button>
                <Button
                  variant="ghost"
                  color="accent"
                  onClick={() => handleFeaturedConsent(false)}
                >
                  No Thanks
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Featured Listings Section */}
        {showFeatured && listings.length > 0 && (
            <div className="mb-12 animate-fade-in" aria-label="Featured listings">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" aria-label="Featured" />
                </div>
                <h2 className="text-3xl font-bold text-white">Featured Listings</h2>
              </div>
            <FeaturedCarousel listings={listings.slice(0, 5)} />
          </div>
        )}

        {/* Promotions Banner */}
          <Card variant="glass" className="mb-12 animate-fade-in border-[#4f8cff]">
            <div className="relative overflow-hidden">
            <div className="relative p-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-[#FFD700]" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#FFD700] bg-clip-text text-transparent">Featured Deals & Promotions</h3>
                    <p className="text-2xl text-white">
                      Discover exclusive offers and trending items
                    </p>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button variant="solid" color="accent" className="shadow-lg">
                  View Promotions
                </Button>
                <Button variant="ghost" color="primary">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Latest Listings Section */}
          <div className="mb-8" aria-label="Latest listings">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-white">Latest Listings</h2>
                <span
                  className="px-3 py-1 bg-white/20 text-white border border-white text-sm font-semibold rounded-none backdrop-blur-sm shadow-none"
                  aria-live="polite"
                >
                {listings.length} items
              </span>
            </div>
          </div>

          {listings.length === 0 ? (
            <Card variant="elevated" className="text-center py-16 animate-fade-in">
                <div className="w-32 h-32 bg-white rounded-none mx-auto mb-6 flex items-center justify-center">
                <Search className="w-16 h-16 text-[#FFD700]" />
              </div>
                <h3 className="text-2xl font-bold text-white mb-2">No listings found</h3>
                <p className="text-white mb-6 max-w-md mx-auto">
                Try adjusting your search criteria or browse all categories to find what you're looking for.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="ghost"
                  color="primary"
                  onClick={() => navigate('/feed')}
                >
                  Browse All
                </Button>
                <Button
                  variant="solid"
                  color="accent"
                  onClick={() => navigate('/add')}
                >
                  Post a Listing
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

              {listings.map(listing => (
                <ListingCard key={listing.id} {...listing} price={listing.price?.toString?.() || ''} image={listing.images[0]} />
              ))}
            </div>
          )}
        </div>
      </Container>
      </div>
    </div>
  );
}

// Tailwind CSS custom animation (add to your global CSS if not present):
// .animate-fade-in { @apply opacity-0 translate-y-4; animation: fadeIn 0.5s forwards; }
// @keyframes fadeIn { to { opacity: 1; transform: none; } } 