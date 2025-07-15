import { User } from '../types';
import { API_BASE_URL } from '../constants';

export async function fetchUser(id: string, token?: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/user/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

export async function revealUserPhone(id: string, token: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/user/${id}/reveal-phone`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Not authorized to view phone number');
  const data = await res.json();
  return data.phone;
}

export async function updateUser(
  userId: string,
  updates: Partial<User> & { currentPassword?: string },
  token?: string
): Promise<User> {
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(): Promise<void> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const res = await fetch(`${API_BASE_URL}/user/${user.id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete user');
}

// Favorites API functions
export async function getFavorites(): Promise<string[]> {
  const token = localStorage.getItem('token');
  console.log('Getting favorites with token:', token ? 'Token exists' : 'No token');
  
  const res = await fetch(`${API_BASE_URL}/user/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log('Favorites response status:', res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Favorites error response:', errorText);
    throw new Error('Failed to fetch favorites');
  }
  
  const favorites = await res.json();
  console.log('Favorites response:', favorites);
  return favorites.map((fav: any) => fav._id || fav.id);
}

export async function addFavorite(listingId: string): Promise<void> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/user/favorites/${listingId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to add favorite');
}

export async function removeFavorite(listingId: string): Promise<void> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/user/favorites/${listingId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to remove favorite');
} 