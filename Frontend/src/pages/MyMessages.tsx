import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Container, Button, LoadingSpinner } from '../components/ui';
import { getAllMessages, markMessagesAsRead } from '../api/messages';
import { fetchUser } from '../api/user';
import { fetchListingById } from '../api/listings';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Clock, Sparkles, Search, Filter } from 'lucide-react';
import { socket, registerUser } from '../utils/socket';

// Helper to group messages by conversation (listingId + otherUserId)
function groupConversations(messages, userId) {
  const map = new Map();
  messages.forEach(msg => {
    // Conversation key: listingId + other user
    const otherUserId = msg.senderId === userId ? msg.recipientId : msg.senderId;
    const key = `${msg.listingId}_${otherUserId}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(msg);
  });
  // Sort by last message time (desc)
  return Array.from(map.values()).sort((a, b) => {
    const lastA = a[a.length - 1]?.createdAt || 0;
    const lastB = b[b.length - 1]?.createdAt || 0;
    return new Date(lastB).getTime() - new Date(lastA).getTime();
  });
}

function MyMessagesSkeleton() {
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
        {/* Conversation cards skeleton */}
        <div className="space-y-4 animate-fade-in">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 bg-white/10 rounded-xl animate-pulse flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 animate-pulse" />
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

export default function MyMessages() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversationInfo, setConversationInfo] = useState({}); // { [key]: { user, listing } }
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);
  const navigate = useNavigate();
  const isMounted = useRef(true);

  // Helper to fetch user and listing info for a conversation
  const fetchConversationInfo = async (conv, userId) => {
    const lastMsg = conv[conv.length - 1];
    const otherUserId = lastMsg.senderId === userId ? lastMsg.recipientId : lastMsg.senderId;
    const key = `${lastMsg.listingId}_${otherUserId}`;
    if (conversationInfo[key]) return; // Already fetched
    try {
      const [userData, listingData] = await Promise.all([
        fetchUser(otherUserId),
        fetchListingById(lastMsg.listingId),
      ]);
      setConversationInfo(prev => ({
        ...prev,
        [key]: { user: userData, listing: listingData },
      }));
    } catch {
      // Ignore errors for now
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      if (!token) {
        setMessages([]);
      } else {
        const msgs = await getAllMessages(token);
        setMessages(msgs);
      }
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Always fetch on mount and when page becomes visible
  useEffect(() => {
    isMounted.current = true;
    fetchMessages();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchMessages();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      isMounted.current = false;
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [token]);

  // Socket.IO real-time updates
  useEffect(() => {
    if (!user?.id) return;
    socket.connect();
    registerUser(user.id);
    const handleNewMessage = (msg) => {
      // Only re-fetch if the message is for this user
      if (msg.recipientId === user.id || msg.senderId === user.id) {
        fetchMessages();
      }
    };
    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.disconnect();
    };
  }, [user?.id]);

  // Fetch conversation info for all conversations
  useEffect(() => {
    if (!user?.id) return;
    const conversations = groupConversations(messages, user.id);
    conversations.forEach(conv => {
      fetchConversationInfo(conv, user.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, user?.id]);

  if (loading) {
    return <MyMessagesSkeleton />;
  }

  const conversations = groupConversations(messages, user?.id);
  
  // Filter conversations based on search and unread filter
  const filteredConversations = conversations.filter(conv => {
    const lastMsg = conv[conv.length - 1];
    const userId = user?.id;
    const otherUserId = lastMsg.senderId === userId ? lastMsg.recipientId : lastMsg.senderId;
    const key = `${lastMsg.listingId}_${otherUserId}`;
    const info = conversationInfo[key] || {};
    const otherUserName = info.user?.name || lastMsg.senderId === userId ? lastMsg.recipientName : lastMsg.senderName || 'User';
    const listingTitle = info.listing?.title || lastMsg.listingTitle || 'Listing';
    const hasUnread = conv.some(m => !m.isRead && m.recipientId === userId);
    
    const matchesSearch = searchTerm === '' || 
      otherUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastMsg.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUnreadFilter = !filterUnread || hasUnread;
    
    return matchesSearch && matchesUnreadFilter;
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse-glow">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-3">My Messages</h1>
          <p className="text-primary-600 text-lg">Stay connected with buyers and sellers</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="w-5 h-5 text-accent-500" />
            <span className="text-sm text-primary-500 font-medium">Real-time messaging</span>
            <Sparkles className="w-5 h-5 text-accent-500" />
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card variant="elevated" className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-300 placeholder:text-primary-400"
              />
            </div>
            <Button
              variant={filterUnread ? "solid" : "outline"}
              color="primary"
              icon={Filter}
              onClick={() => setFilterUnread(!filterUnread)}
              className="whitespace-nowrap"
            >
              {filterUnread ? 'Show All' : 'Unread Only'}
            </Button>
          </div>
        </Card>

        {/* Conversations */}
        {filteredConversations.length === 0 ? (
          <Card variant="elevated" className="text-center py-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-32 h-32 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <MessageCircle className="w-16 h-16 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-primary-700 mb-2">
              {searchTerm || filterUnread ? 'No matching conversations' : 'No conversations yet'}
            </h3>
            <p className="text-primary-600 mb-6">
              {searchTerm || filterUnread 
                ? 'Try adjusting your search or filter criteria' 
                : 'Start browsing listings to connect with sellers and buyers'
              }
            </p>
            {!searchTerm && !filterUnread && (
              <Button variant="solid" color="primary" onClick={() => navigate('/')}>
                Browse Listings
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {filteredConversations.map((conv, index) => {
              const lastMsg = conv[conv.length - 1];
              const userId = user?.id;
              const otherUserId = lastMsg.senderId === userId ? lastMsg.recipientId : lastMsg.senderId;
              const key = `${lastMsg.listingId}_${otherUserId}`;
              const info = conversationInfo[key] || {};
              const otherUserName = info.user?.name || lastMsg.senderId === userId ? lastMsg.recipientName : lastMsg.senderName || 'User';
              const listingTitle = info.listing?.title || lastMsg.listingTitle || 'Listing';
              const listingImg = info.listing?.images?.[0] || lastMsg.listingImage || 'https://placehold.co/80x80';
              const avatarUrl = info.user?.profilePic || `https://api.dicebear.com/7.x/identicon/svg?seed=${otherUserId}`;
              // Unread logic: any message in this conversation not read and recipient is current user
              const hasUnread = conv.some(m => !m.isRead && m.recipientId === userId);
              const unreadCount = conv.filter(m => !m.isRead && m.recipientId === userId).length;
              
              const handleOpenConversation = async () => {
                navigate(`/messages/${lastMsg.listingId}/${otherUserId}`);
                if (hasUnread && userId && token) {
                  conv.forEach(m => { if (m.recipientId === userId) m.isRead = true; });
                  try {
                    await markMessagesAsRead({ listingId: lastMsg.listingId, userId: otherUserId }, token);
                  } catch {}
                }
              };
              
              return (
                <Card
                  key={lastMsg.listingId + '_' + otherUserId}
                  variant="elevated"
                  className={`p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer relative animate-fade-in ${
                    hasUnread ? 'ring-2 ring-primary-400/60 bg-gradient-to-r from-primary-50/50 to-secondary-50/50' : ''
                  }`}
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                  onClick={handleOpenConversation}
                >
                  <div className="flex items-center gap-4">
                    {/* Listing Image */}
                    <div className="relative">
                      <img 
                        src={listingImg} 
                        alt="Listing" 
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white/40 shadow-lg" 
                      />
                      {hasUnread && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                      )}
                    </div>
                    
                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-primary-700 text-lg truncate">{listingTitle}</h3>
                        {hasUnread && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <img 
                          src={avatarUrl} 
                          alt={otherUserName} 
                          className="w-8 h-8 rounded-full border-2 border-white/40 shadow" 
                        />
                        <span className="text-primary-600 font-semibold">{otherUserName || 'User'}</span>
                      </div>
                      
                      <p className="text-primary-500 text-sm line-clamp-2">
                        {lastMsg.content}
                      </p>
                    </div>
                    
                    {/* Time and Status */}
                    <div className="flex flex-col items-end gap-2 min-w-[80px]">
                      <span className="text-xs text-primary-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lastMsg.createdAt ? new Date(lastMsg.createdAt).toLocaleDateString() : ''}
                      </span>
                      <span className="text-xs text-primary-400">
                        {lastMsg.createdAt ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 