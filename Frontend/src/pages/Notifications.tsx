import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationAsRead } from '../api/notifications';
import { Card, Container, Button, LoadingSpinner } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, Sparkles, MessageCircle, Heart, Star, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useToast } from '../toast/ToastProvider';

function NotificationsSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        {/* Header skeleton */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 animate-pulse" />
          <div className="h-8 w-1/2 bg-white/20 rounded mx-auto mb-3 animate-pulse" />
          <div className="h-5 w-1/3 bg-white/10 rounded mx-auto mb-2 animate-pulse" />
        </div>
        {/* Filter bar skeleton */}
        <div className="mb-6 animate-fade-in">
          <div className="h-10 w-full bg-white/10 rounded animate-pulse" />
        </div>
        {/* Notification items skeleton */}
        <div className="space-y-4 animate-fade-in">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 bg-white/10 rounded-xl animate-pulse flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-1/2 bg-white/20 rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Notifications() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getNotifications(token);
        setNotifications(data);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchData();
  }, [token]);

  const handleMarkAsRead = async (id: string, link?: string) => {
    try {
      await markNotificationAsRead(id, token);
      setNotifications(n => n.map(notif => notif._id === id ? { ...notif, isRead: true } : notif));
      if (link) navigate(link);
    } catch {
      toast.addToast('Failed to mark notification as read', 'error');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'message':
        return <MessageCircle className="w-5 h-5" />;
      case 'favorite':
        return <Heart className="w-5 h-5" />;
      case 'review':
        return <Star className="w-5 h-5" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'message':
        return 'text-blue-600 bg-blue-100';
      case 'favorite':
        return 'text-red-600 bg-red-100';
      case 'review':
        return 'text-yellow-600 bg-yellow-100';
      case 'alert':
        return 'text-orange-600 bg-orange-100';
      case 'success':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-primary-600 bg-primary-100';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return <NotificationsSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse-glow">
            <Bell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-3">Notifications</h1>
          <p className="text-primary-600 text-lg">Stay updated with your marketplace activity</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="w-5 h-5 text-accent-500" />
            <span className="text-sm text-primary-500 font-medium">Real-time updates</span>
            <Sparkles className="w-5 h-5 text-accent-500" />
          </div>
        </div>

        {/* Filter Bar */}
        <Card variant="elevated" className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-primary-700 font-semibold">Filter:</span>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'solid' : 'outline'}
                  color="primary"
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'solid' : 'outline'}
                  color="primary"
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  variant={filter === 'read' ? 'solid' : 'outline'}
                  color="primary"
                  size="sm"
                  onClick={() => setFilter('read')}
                >
                  Read ({notifications.length - unreadCount})
                </Button>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                color="primary"
                size="sm"
                icon={Check}
                onClick={() => {
                  // Mark all as read
                  notifications.forEach(notif => {
                    if (!notif.isRead) {
                      handleMarkAsRead(notif._id);
                    }
                  });
                }}
              >
                Mark All Read
              </Button>
            )}
          </div>
        </Card>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card variant="elevated" className="text-center py-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-32 h-32 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Bell className="w-16 h-16 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-primary-700 mb-2">
              {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
            </h3>
            <p className="text-primary-600 mb-6">
              {filter === 'all' 
                ? 'You\'ll see notifications about messages, favorites, and other activity here'
                : `You have no ${filter} notifications at the moment`
              }
            </p>
            {filter === 'all' && (
              <Button variant="solid" color="primary" onClick={() => navigate('/')}>
                Start Browsing
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {filteredNotifications.map((notif, index) => (
              <Card
                key={notif._id}
                variant="glass"
                className={`p-6 hover:shadow-blue-200/60 hover:scale-[1.02] hover:border-[#3578e5] transition-all duration-300 cursor-pointer relative animate-fade-in ${!notif.isRead ? 'ring-2 ring-[#4f8cff]/60 bg-gradient-to-r from-[#e3f2fd]/60 to-[#4f8cff]/30' : 'bg-white/50 backdrop-blur-sm'}`}
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                onClick={() => handleMarkAsRead(notif._id, notif.link)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getNotificationColor(notif.type)}`}>
                    {getNotificationIcon(notif.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-primary-700 text-lg">{notif.type}</h3>
                      {!notif.isRead && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold animate-pulse">
                          New
                        </span>
                      )}
                    </div>
                    
                    <p className="text-primary-600 mb-3 leading-relaxed">{notif.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-primary-400 flex items-center gap-1">
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : ''}
                        {notif.createdAt && (
                          <span className="text-primary-300">•</span>
                        )}
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                      
                      {notif.link && (
                        <Button
                          variant="outline"
                          color="primary"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            handleMarkAsRead(notif._id, notif.link);
                          }}
                        >
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  {!notif.isRead && (
                    <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse" title="Unread" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 