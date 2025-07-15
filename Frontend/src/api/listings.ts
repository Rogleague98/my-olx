import type { Listing } from '../types';
// Use a custom type for the payload to match backend expectations
export type ListingPayload = {
  title: string;
  description: string;
  price: number;
  images: any;
  category: string;
  subcategory: string;
  location: string;
  seller: string;
};
import { API_BASE_URL as API_BASE_URL_CONST } from '../constants';

// Mock data
let listings: Listing[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro',
    description: 'Brand new, never used.',
    price: 999,
    images: [],
    category: 'Electronics',
    subcategory: 'Phones',
    sellerId: '1',
    createdAt: new Date().toISOString(),
    city: 'Sofia',         // <-- add this
    location: 'Sofia',     // <-- add this
  },
];

export async function fetchListings(): Promise<Listing[]> {
  const res = await fetch(`${API_BASE_URL}/listings`);
  if (!res.ok) throw new Error('Failed to fetch listings');
  const data = await res.json();
  console.log('Fetched listings:', data);
  return data;
}

export async function fetchListingById(id: string): Promise<Listing> {
  const res = await fetch(`${API_BASE_URL}/listings/${id}`);
  if (!res.ok) throw new Error('Listing not found');
  return res.json();
}

export async function createListing(
  listing: ListingPayload,
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(listing),
  });
  if (!res.ok) throw new Error('Failed to create listing');
  return res.json();
}

export async function updateListing(id: string, updates: Partial<Listing>, token: string) {
  const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update listing');
  return res.json();
}

export async function deleteListing(id: string) {
  const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete listing');
  return res.json();
}

export const API_BASE_URL = 'http://localhost:5000'; 