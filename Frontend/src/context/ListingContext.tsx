import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Listing } from '../types';
import { fetchListings } from '../api/listings';

type ListingContextType = {
  listings: Listing[];
  refresh: () => void;
};

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export function ListingProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);

  const refresh = async () => {
    const data = await fetchListings();
    setListings(data);
  };

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <ListingContext.Provider value={{ listings, refresh }}>
      {children}
    </ListingContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingContext);
  if (!context) throw new Error('useListings must be used within ListingProvider');
  return context;
} 