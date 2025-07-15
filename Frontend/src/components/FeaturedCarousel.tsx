import React, { useRef } from 'react';
import ListingCard from './ListingCard';

export default function FeaturedCarousel({ listings, title = 'Featured Listings' }: { listings: any[]; title?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = scrollRef.current.offsetWidth * 0.7;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  if (!listings || listings.length === 0) return null;

  return (
    <section className="w-full max-w-5xl mx-auto mb-12 animate-fade-in">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl font-bold text-cyan-900 drop-shadow">{title}</h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-cyan-100 hover:bg-cyan-300 transition" onClick={() => scroll('left')}>
            <span className="text-2xl">&#8592;</span>
          </button>
          <button className="p-2 rounded-full bg-cyan-100 hover:bg-cyan-300 transition" onClick={() => scroll('right')}>
            <span className="text-2xl">&#8594;</span>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-cyan-200 scrollbar-track-transparent"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {listings.map((listing, idx) => (
          <div key={listing.id || idx} className="min-w-[300px] max-w-xs flex-shrink-0 scroll-snap-align-start">
            <ListingCard
              id={listing.id}
              title={listing.title}
              price={listing.price.toString()}
              image={listing.images[0]}
            />
          </div>
        ))}
      </div>
    </section>
  );
} 