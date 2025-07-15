export async function getNotifications(token: string) {
  const res = await fetch('/api/notifications', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function markNotificationAsRead(id: string, token: string) {
  const res = await fetch(`/api/notifications/${id}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
  return res.json();
}

export async function getUnreadNotificationCount(token: string) {
  const res = await fetch('/api/notifications/unread-count', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch unread notification count');
  return res.json();
}

export async function createNotification({ userId, type, message, link }: { userId: string, type: string, message: string, link?: string }, token: string) {
  const res = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ userId, type, message, link }),
  });
  if (!res.ok) throw new Error('Failed to create notification');
  return res.json();
} 