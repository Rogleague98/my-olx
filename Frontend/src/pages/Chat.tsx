import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Container, Button, Input, LoadingSpinner } from '../components/ui';
import { getConversation, sendMessage } from '../api/messages';
import { ArrowLeft, Send } from 'lucide-react';

// Message type (adjust fields as needed)
interface Message {
  _id?: string;
  senderId: string;
  recipientId: string;
  listingId: string;
  content: string;
  createdAt?: string;
  senderName?: string;
  recipientName?: string;
  listingTitle?: string;
  listingImage?: string;
  senderProfilePic?: string;
}

export default function Chat() {
  const { listingId = '', otherUserId = '' } = useParams();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchConversation() {
      setLoading(true);
      try {
        const msgs = await getConversation({ userId: otherUserId as string, listingId: listingId as string }, token as string);
        setMessages(msgs || []);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }
    if (listingId && otherUserId && token) fetchConversation();
  }, [listingId, otherUserId, token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      const msg = await sendMessage({ recipientId: otherUserId as string, listingId: listingId as string, content: input }, token as string                 );
      setMessages((prev: any[]) => [...prev, msg]);
      setInput('');
    } catch {
      // Optionally show error
    } finally {
      setSending(false);
    }
  };

  // Placeholder listing/user info
  const listingTitle = messages[0]?.listingTitle || 'Listing';
  const listingImg = messages[0]?.listingImage || 'https://placehold.co/60x60';
  const otherUserName = messages.find(m => m.senderId === otherUserId)?.senderName || 'User';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        <Container className="py-2 sm:py-8 max-w-full sm:max-w-2xl mx-auto">
          {/* Sticky top bar for mobile */}
          <div className="sm:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-md flex items-center gap-2 px-4 py-3 border-b border-white/30">
            <Button icon={ArrowLeft} variant="ghost" onClick={() => navigate('/messages')}>
              {''}
            </Button>
            <img src={listingImg} alt="Listing" className="w-10 h-10 rounded-lg object-cover border border-white/40 shadow" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-primary-700 text-base truncate">{listingTitle}</div>
              <div className="text-primary-500 text-xs truncate">with {otherUserName}</div>
            </div>
          </div>
          {/* Desktop header */}
          <Card className="hidden sm:flex items-center gap-4 p-4 mb-4">
            <Button icon={ArrowLeft} variant="ghost" onClick={() => navigate('/messages')}>
              {''}
            </Button>
            <img src={listingImg} alt="Listing" className="w-12 h-12 rounded-lg object-cover border border-white/40 shadow" />
            <div>
              <div className="font-semibold text-primary-700">{listingTitle}</div>
              <div className="text-primary-500 text-sm">with {otherUserName}</div>
            </div>
          </Card>
          <div className="mb-3 text-primary-600 text-xs bg-white/60 rounded-lg p-2 border border-white/30 text-center">
            Payment is arranged directly between buyer and seller. <b>Cash on Delivery is recommended.</b>
          </div>
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-2 sm:p-4 h-[60vh] overflow-y-auto flex flex-col gap-2 mb-4 border border-white/30">
            {loading ? (
              <div className="flex justify-center items-center h-full"><LoadingSpinner size="lg" /></div>
            ) : messages.length === 0 ? (
              <div className="text-center text-primary-500 mt-12">No messages yet. Start the conversation!</div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.senderId === user?.id;
                const avatarUrl = msg.senderProfilePic || `https://api.dicebear.com/7.x/identicon/svg?seed=${msg.senderId}`;
                return (
                  <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {!isMe && (
                      <img
                        src={avatarUrl}
                        alt={msg.senderName || 'User'}
                        className="w-8 h-8 rounded-full border border-white/40 shadow"
                      />
                    )}
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md text-sm ${isMe ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' : 'bg-white/80 text-primary-700 border border-white/40'} flex flex-col`}>
                      <span className="font-semibold text-xs mb-1 text-primary-400">
                        {isMe ? 'You' : msg.senderName || 'User'}
                      </span>
                      <span>{msg.content}</span>
                      <span className="text-xs text-primary-400 mt-1 self-end">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}</span>
                    </div>
                    {isMe && (
                      <img
                        src={avatarUrl}
                        alt="You"
    <Container className="py-2 sm:py-8 max-w-full sm:max-w-2xl mx-auto">
      {/* Sticky top bar for mobile */}
      <div className="sm:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-md flex items-center gap-2 px-4 py-3 border-b border-white/30">
        <Button icon={ArrowLeft} variant="ghost" onClick={() => navigate('/messages')}>
          {''}
        </Button>
        <img src={listingImg} alt="Listing" className="w-10 h-10 rounded-lg object-cover border border-white/40 shadow" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-primary-700 text-base truncate">{listingTitle}</div>
          <div className="text-primary-500 text-xs truncate">with {otherUserName}</div>
        </div>
      </div>
      {/* Desktop header */}
      <Card className="hidden sm:flex items-center gap-4 p-4 mb-4">
        <Button icon={ArrowLeft} variant="ghost" onClick={() => navigate('/messages')}>
          {''}
        </Button>
        <img src={listingImg} alt="Listing" className="w-12 h-12 rounded-lg object-cover border border-white/40 shadow" />
        <div>
          <div className="font-semibold text-primary-700">{listingTitle}</div>
          <div className="text-primary-500 text-sm">with {otherUserName}</div>
        </div>
      </Card>
      <div className="mb-3 text-primary-600 text-xs bg-white/60 rounded-lg p-2 border border-white/30 text-center">
        Payment is arranged directly between buyer and seller. <b>Cash on Delivery is recommended.</b>
      </div>
      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-2 sm:p-4 h-[60vh] overflow-y-auto flex flex-col gap-2 mb-4 border border-white/30">
        {loading ? (
          <div className="flex justify-center items-center h-full"><LoadingSpinner size="lg" /></div>
        ) : messages.length === 0 ? (
          <div className="text-center text-primary-500 mt-12">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === user?.id;
            const avatarUrl = msg.senderProfilePic || `https://api.dicebear.com/7.x/identicon/svg?seed=${msg.senderId}`;
            return (
              <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {!isMe && (
                  <img
                    src={avatarUrl}
                    alt={msg.senderName || 'User'}
                    className="w-8 h-8 rounded-full border border-white/40 shadow"
                  />
                )}
                <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md text-sm ${isMe ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' : 'bg-white/80 text-primary-700 border border-white/40'} flex flex-col`}>
                  <span className="font-semibold text-xs mb-1 text-primary-400">
                    {isMe ? 'You' : msg.senderName || 'User'}
                  </span>
                  <span>{msg.content}</span>
                  <span className="text-xs text-primary-400 mt-1 self-end">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}</span>
                </div>
                {isMe && (
                  <img
                    src={avatarUrl}
                    alt="You"
                    className="w-8 h-8 rounded-full border border-white/40 shadow"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="flex gap-2 px-1 sm:px-0" onSubmit={handleSend} autoComplete="off">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={sending}
        />
        <Button type="submit" icon={Send} disabled={sending || !input.trim()} loading={sending} variant="solid" color="primary" aria-label="Send message">
          Send
        </Button>
      </form>
    </Container>
  );
} 