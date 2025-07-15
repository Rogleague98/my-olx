import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, HeartOff, CheckCircle, Eye, MapPin } from 'lucide-react';
import { addFavorite, removeFavorite } from '../api/user';
import { useAuth } from '../context/AuthContext';
import { Card } from './ui';
import { categories } from '../constants';
import * as LucideIcons from 'lucide-react';

type ListingCardProps = {
  title: string;
  price: string;
  image?: any;
  id: string;
  category?: string;
  subcategory?: string;
  location?: string;
  onFavoriteToggle?: (id: string, isFav: boolean) => void;
  verified?: boolean;
  viewMode?: 'grid' | 'list';
};

export default function ListingCard({ 
  title, 
  price, 
  image, 
  id, 
  category, 
  subcategory, 
  location, 
  onFavoriteToggle, 
  verified,
  viewMode = 'grid'
}: ListingCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log('ListingCard props:', { title, price, image, id, verified });

  useEffect(() => {
    // Check if user is logged in and has favorites
    if (user) {
      const favs = localStorage.getItem('favorites');
      if (favs) {
        setIsFav(JSON.parse(favs).includes(id));
      }
    }
  }, [id, user]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    console.log('Toggling favorite for listing ID:', id);
    
    setLoading(true);
    try {
      if (isFav) {
        await removeFavorite(id);
        // Update localStorage
        let favs = localStorage.getItem('favorites');
        let favArr: string[] = favs ? JSON.parse(favs) : [];
        favArr = favArr.filter(f => f !== id);
        localStorage.setItem('favorites', JSON.stringify(favArr));
        setIsFav(false);
        if (onFavoriteToggle) onFavoriteToggle(id, false);
      } else {
        await addFavorite(id);
        // Update localStorage
        let favs = localStorage.getItem('favorites');
        let favArr: string[] = favs ? JSON.parse(favs) : [];
        favArr.push(id);
        localStorage.setItem('favorites', JSON.stringify(favArr));
        setIsFav(true);
        if (onFavoriteToggle) onFavoriteToggle(id, true);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Revert the UI state on error
      setIsFav(!isFav);
    } finally {
      setLoading(false);
    }
  };

  // Find category icon
  let catIcon = LucideIcons.Circle;
  if (category) {
    const catObj = categories.find(c => c.name === category);
    if (catObj && catObj.icon && (LucideIcons as any)[catObj.icon]) {
      catIcon = (LucideIcons as any)[catObj.icon];
    }
  }

  if (viewMode === 'list') {
    return (
      <Card 
        className="relative cursor-pointer group overflow-hidden hover:shadow-blue-200/60 hover:scale-[1.03] hover:border-[#3578e5] transition-all duration-300"
        onClick={() => navigate(`/listing/${id}`)}
      >
        <div className="flex gap-6">
          {/* Image Container */}
          <div className="w-48 h-32 bg-gradient-to-br from-primary-100/20 to-secondary-100/20 rounded-xl flex items-center justify-center overflow-hidden relative group flex-shrink-0">
            <img 
              src={image} 
              alt={title} 
              className="object-cover w-full h-full rounded-xl"
              style={{ background: '#fff' }}
              loading="lazy"
              onError={e => { e.currentTarget.src = '/fallback-image.png'; }}
            />
            
            {/* Favorite Button */}
            <button
              className={`absolute top-2 right-2 p-1.5 rounded-full border transition-all duration-300 z-10 shadow-lg hover:scale-110 ${
                isFav 
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500 shadow-xl scale-110' 
                  : 'bg-white/20 backdrop-blur-md text-primary-600 border-primary-300/50 hover:bg-primary-50'
              }`}
              title={isFav ? 'Remove from Favorites' : 'Save to Favorites'}
              onClick={toggleFavorite}
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                isFav ? <HeartOff className="w-4 h-4" /> : <Heart className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <h3 className="font-bold text-xl mb-2 text-white flex items-center gap-2 line-clamp-1">
                {title}
                {verified && (
                  <span 
                    title="Verified Listing" 
                    className="inline-flex items-center gap-1 px-2 py-1 bg-success/20 text-success rounded-lg text-xs font-semibold transition-all duration-300 hover:bg-success/30"
                  >
                    <CheckCircle className="w-4 h-4" /> Verified
                  </span>
                )}
              </h3>
              
              {/* Category & Subcategory */}
              {(category || subcategory) && (
                <div className="flex items-center gap-2 mb-2 text-white text-sm font-semibold">
                  <span className="flex items-center gap-1">
                    {category}
                  </span>
                  {subcategory && <span className="text-white">/ {subcategory}</span>}
                </div>
              )}
              
              {/* Location */}
              {location && (
                <div className="flex items-center gap-1 mb-2 text-white text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-white font-bold text-2xl">${price}</div>
              <button 
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform group-hover:from-secondary-500 group-hover:to-primary-500" 
                onClick={e => { 
                  e.stopPropagation(); 
                  navigate(`/listing/${id}`); 
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card 
      className="relative cursor-pointer group min-h-[380px] overflow-hidden hover:shadow-blue-200/60 hover:scale-[1.03] hover:border-[#3578e5] transition-all duration-300"
      onClick={() => navigate(`/listing/${id}`)}
    >
      {/* Favorite Button */}
      <button
        className={`absolute top-4 right-4 p-2 rounded-full border-2 transition-all duration-300 z-10 shadow-lg hover:scale-110 ${
          isFav 
            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500 shadow-xl scale-110' 
            : 'bg-white/20 backdrop-blur-md text-primary-600 border-primary-300/50 hover:bg-primary-50'
        }`}
        title={isFav ? 'Remove from Favorites' : 'Save to Favorites'}
        onClick={toggleFavorite}
        disabled={loading}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          isFav ? <HeartOff className="w-5 h-5" /> : <Heart className="w-5 h-5" />
        )}
      </button>

      {/* Image Container */}
      <div className="w-full h-48 bg-gradient-to-br from-primary-100/20 to-secondary-100/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative group">
        <img 
          src={image} 
          alt={title} 
          className="object-cover w-full h-full rounded-xl"
          style={{ background: '#fff' }}
          loading="lazy"
          onError={e => { e.currentTarget.src = '/fallback-image.png'; }}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-md rounded-full p-3 shadow-lg">
              <Eye className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-2 text-white flex items-center gap-2 line-clamp-2">
          {title}
          {verified && (
            <span 
              title="Verified Listing" 
              className="inline-flex items-center gap-1 px-2 py-1 bg-success/20 text-success rounded-lg text-xs font-semibold transition-all duration-300 hover:bg-success/30"
            >
              <CheckCircle className="w-4 h-4" /> Verified
            </span>
          )}
        </h3>
        
        {/* Category & Subcategory */}
        {(category || subcategory) && (
          <div className="flex items-center gap-2 mb-1 text-white text-xs font-semibold">
            <span className="flex items-center gap-1">
              {category}
            </span>
            {subcategory && <span className="text-white">/ {subcategory}</span>}
          </div>
        )}
        
        {/* Location */}
        {location && (
          <div className="flex items-center gap-1 mb-2 text-white text-xs font-medium">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        )}
        
        <div className="text-white font-bold text-2xl mb-4">${price}</div>
        
        <button 
          className="mt-auto px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform group-hover:from-secondary-500 group-hover:to-primary-500" 
          onClick={e => { 
            e.stopPropagation(); 
            navigate(`/listing/${id}`); 
          }}
        >
          View Details
        </button>
      </div>
    </Card>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-white shadow-lg p-4 flex flex-col gap-4 animate-fade-in">
      <div className="w-full h-40 bg-primary-100 rounded-2xl loading-shimmer" />
      <div className="h-6 w-3/4 bg-primary-100 rounded loading-shimmer" />
      <div className="h-5 w-1/3 bg-primary-100 rounded loading-shimmer" />
    </div>
  );
} 