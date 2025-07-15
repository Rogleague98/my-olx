import { API_BASE_URL } from '../constants';

export async function sendMessage({ recipientId, listingId, content }: { recipientId: string; listingId: string; content: string }, token: string) {
  const res = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recipientId, listingId, content }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function getConversation({ userId, listingId }: { userId: string; listingId: string }, token: string) {
  const params = new URLSearchParams({ userId, listingId });
  const res = await fetch(`${API_BASE_URL}/messages/conversation?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch conversation');
  return res.json();
}

export async function getAllMessages(token: string) {
  const res = await fetch(`${API_BASE_URL}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function markMessagesAsRead({ listingId, userId }: { listingId: string, userId: string }, token: string) {
  const res = await fetch(`/api/messages/read`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ listingId, userId }),
  });
  if (!res.ok) throw new Error('Failed to mark messages as read');
  return res.json();
}

export async function getUnreadCount(token: string) {
  const res = await fetch(`/api/messages/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch unread count');
  return res.json();
} 