import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { User as UserIcon, Star, MessageCircle, Heart, ShieldAlert, CheckCircle, Share2, Copy as CopyIcon, Clock, ThumbsUp, ThumbsDown, Check, Globe, Twitter } from 'lucide-react';
import { Card, LoadingSpinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../toast/ToastProvider';
import { revealUserPhone } from '../api/user';
// @ts-ignore
import confetti from 'canvas-confetti';

function SellerProfileSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        {/* Profile header skeleton */}
        <div className="w-full max-w-3xl px-2 sm:px-4 py-8">
          <div className="flex items-center gap-4 mb-8 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-white/20 animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-1/2 bg-white/20 rounded animate-pulse" />
              <div className="h-5 w-1/3 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-1/4 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
        {/* Listings grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 animate-fade-in">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-white/10 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SellerProfile() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seller, setSeller] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [following, setFollowing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const toast = useToast();
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [sellerPhone, setSellerPhone] = useState<string | null>(null);
  const [revealLoading, setRevealLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    async function fetchSeller() {
      setLoading(true);
      setError('');
      try {
        // Fetch seller info
        const res = await fetch(`/api/user/${sellerId}`);
        if (!res.ok) throw new Error('Seller not found');
        const sellerData = await res.json();
        setSeller(sellerData);
        // Fetch seller listings
        const resListings = await fetch(`/api/listings?seller=${sellerId}`);
        const listingsData = await resListings.json();
        setListings(listingsData);
      } catch (err: any) {
        setError(err.message || 'Error loading seller');
      } finally {
        setLoading(false);
      }
    }
    if (sellerId) fetchSeller();
  }, [sellerId]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleRevealPhone = async () => {
    if (!user || !user.token) return;
    setRevealLoading(true);
    try {
      const phone = await revealUserPhone(seller.id, user.token as string);
      setSellerPhone(phone);
      setPhoneRevealed(true);
      toast.addToast('Phone number revealed!', 'success');
    } catch (err) {
      toast.addToast('Not authorized to view phone number', 'error');
    } finally {
      setRevealLoading(false);
    }
  };

  // Profile completion calculation
  const completion = [seller.name, seller.profilePic, seller.bio, seller.phone].filter(Boolean).length / 4 * 100;

  // Mock seller.isOnline and achievements/social for demo
  const isOnline = seller.isOnline ?? true;
  const achievements = [
    { icon: '🏆', label: '100+ Sales' },
    { icon: '⚡', label: 'Super Responsive' },
    { icon: '🎉', label: '5+ Years' },
  ];
  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, url: seller.twitter || 'https://twitter.com/', label: 'Twitter' },
    { icon: <Globe className="w-5 h-5" />, url: seller.website || 'https://example.com', label: 'Website' },
  ];

  if (loading) {
    return <SellerProfileSkeleton />;
  }
  if (error || !seller) {
    return <Card className="text-center py-16 text-red-500 font-bold">{error || 'Seller not found.'}</Card>;
  }

  // Dummy reviews for now
  const reviews = [
    { user: 'Alice', rating: 5, comment: 'Great seller!', date: '2024-06-01' },
    { user: 'Bob', rating: 4, comment: 'Smooth transaction.', date: '2024-05-20' },
  ];
  const avgRating = reviews.length ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 'N/A';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        {/* aria-live region for toasts */}
        <div aria-live="polite" className="sr-only" id="toast-announcer"></div>
        <div className="w-full max-w-3xl px-2 sm:px-4 py-8">
          {/* Profile Header Banner with Parallax */}
          <div className="relative mb-[-48px] animate-fade-in">
            <div
              className="absolute inset-0 h-32 bg-gradient-to-r from-primary-400/60 to-primary-200/60 rounded-t-3xl blur-lg z-0 parallax"
              style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            ></div>
            <div className="relative z-10 flex items-center gap-4 p-6">
              <div className="relative">
                <img
                  src={seller.profilePic || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + seller.id}
                  alt="Seller"
                  className={`w-24 h-24 rounded-full object-cover border-4 shadow-xl mx-auto md:mx-0 ${seller.verified ? 'border-animated-gradient' : 'border-cyan-400'}`}
                />
                {isOnline && (
                  <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse" title="Online now"></span>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-2 justify-center">
                <div className="text-2xl font-bold flex items-center gap-2">
                  {seller.name} <UserIcon className="w-5 h-5 text-cyan-400" />
                  {seller.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold animate-fade-in animate-pulse-glow" title="Verified seller">
                      <CheckCircle className="w-4 h-4" /> Verified
                    </span>
                  )}
                </div>
                {/* Achievements */}
                <div className="flex gap-2 mt-2">
                  {achievements.map(a => (
                    <span key={a.label} className="badge" title={a.label}>{a.icon} {a.label}</span>
                  ))}
                </div>
                {/* Social Links */}
                <div className="flex gap-2 mt-2">
                  {socialLinks.map(link => (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener" aria-label={link.label} className="hover:text-cyan-600 transition-colors">{link.icon}</a>
                  ))}
                </div>
                {/* Profile Completion Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Clock className="w-4 h-4" /> {isOnline ? <span className="text-green-500 font-semibold">Online now</span> : 'Active recently'}
                  <span className="ml-2">Response rate: 95%</span>
                </div>
                <div className="text-gray-600">Member since {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : 'N/A'}</div>
                <div className="flex items-center gap-2 text-yellow-500 text-lg">
                  <Star className="w-5 h-5" /> {avgRating} ({reviews.length} reviews)
                </div>
                <div className="text-gray-700 mt-2">{seller.bio}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Listings Section */}
        <div className="mb-12 animate-fade-in delay-100">
          <div className="font-semibold text-cyan-700 mb-4 text-lg">Listings by {seller.name}</div>
          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in empty-illustration">
              <img src="/empty-listings.svg" alt="No listings" className="w-32 h-32 mb-4 opacity-80" />
              <div className="text-cyan-700 font-semibold">No listings yet</div>
              <div className="text-gray-500 text-sm">This seller hasn't posted any listings yet.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {listings.map((listing, idx) => (
                <div
                  key={listing.id}
                  className="rounded-2xl shadow-md bg-white/80 border border-cyan-100 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-cyan-300 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <ListingCard {...listing} price={listing.price?.toString?.() || ''} />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Reviews Section */}
        <div className="mb-8 animate-fade-in delay-200">
          <div className="font-semibold text-cyan-700 mb-4 text-lg">Reviews</div>
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in empty-illustration">
              <img src="/empty-reviews.svg" alt="No reviews" className="w-32 h-32 mb-4 opacity-80" />
              <div className="text-cyan-700 font-semibold">No reviews yet</div>
              <div className="text-gray-500 text-sm">This seller hasn't received any reviews yet.</div>
            </div>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r, i) => (
                <li key={i} className="bg-white/80 border border-cyan-100 rounded-2xl shadow-md p-4 flex flex-col gap-2 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${r.user}`} alt={r.user} className="w-8 h-8 rounded-full border border-cyan-200" />
                    <span className="font-bold text-cyan-700 text-base">{r.user}</span>
                  </div>
                  <span className="flex items-center gap-1 text-yellow-500 text-sm"><Star className="w-4 h-4" /> {r.rating}</span>
                  <span className="text-gray-700">{r.comment}</span>
                  <span className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString()}</span>
                  <div className="flex gap-2 mt-2">
                    <button className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 ripple" aria-label="Helpful" onClick={e => { e.currentTarget.classList.add('flash-green'); setTimeout(() => e.currentTarget.classList.remove('flash-green'), 400); }}><ThumbsUp className="w-4 h-4" /> Helpful <span className="ml-1">{Math.floor(Math.random()*10)}</span></button>
                    <button className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 ripple" aria-label="Not helpful" onClick={e => { e.currentTarget.classList.add('flash-green'); setTimeout(() => e.currentTarget.classList.remove('flash-green'), 400); }}><ThumbsDown className="w-4 h-4" /> Not helpful <span className="ml-1">{Math.floor(Math.random()*3)}</span></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Sticky Action Bar (Mobile) */}
        <div className="sticky-action-bar fixed bottom-0 left-0 right-0 z-40 flex sm:hidden bg-white/90 backdrop-blur-md border-t border-cyan-100 shadow-xl p-2 gap-2 justify-around animate-fade-in">
          <button className="flex-1 flex items-center justify-center gap-2 px-2 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 ripple focus:ring-2 focus:ring-cyan-400" onClick={() => navigate(`/messages/${seller.id}/${user?.id}`)} aria-label="Contact Seller"><MessageCircle className="w-5 h-5" /> Contact</button>
          <button className="flex-1 flex items-center justify-center gap-2 px-2 py-2 bg-gray-100 text-pink-600 rounded-xl hover:bg-pink-100 ripple focus:ring-2 focus:ring-pink-400" onClick={() => { setFollowing(f => !f); confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } }); }} aria-label={following ? 'Unfollow Seller' : 'Follow Seller'}><Heart className="w-5 h-5" /> {following ? <span className="flex items-center gap-1 animate-check"><Check className="w-4 h-4 text-white" /> Following</span> : 'Follow'}</button>
          <button className="flex-1 flex items-center justify-center gap-2 px-2 py-2 bg-gray-100 text-cyan-700 rounded-xl hover:bg-cyan-200 ripple focus:ring-2 focus:ring-cyan-400" onClick={e => {navigator.clipboard.writeText(window.location.origin + '/profile/' + seller.id); toast.addToast('Profile link copied!', 'info'); e.currentTarget.classList.add('flash-green'); setTimeout(() => e.currentTarget.classList.remove('flash-green'), 400);}} aria-label="Share Seller Profile"><Share2 className="w-5 h-5" /> Share</button>
        </div>
        {/* Report Modal */}
        {showReport && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col animate-fade-in">
              <h2 className="text-lg font-bold mb-2 text-red-600 flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Report User</h2>
              <form onSubmit={async e => {
                e.preventDefault();
                if (!reportReason) return toast.addToast('Please select a reason.', 'error');
                try {
                  const res = await fetch('/api/report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                    body: JSON.stringify({ reportedUser: seller.id, reason: reportReason, details: reportDetails }),
                  });
                  if (!res.ok) throw new Error((await res.json()).message || 'Failed to submit report');
                  toast.addToast('Report submitted. Thank you!', 'success');
                  setShowReport(false);
                  setReportReason('');
                  setReportDetails('');
                } catch (err: any) {
                  toast.addToast(err.message || 'Failed to submit report', 'error');
                }
              }}>
                <label className="block mb-2 font-medium">Reason</label>
                <select className="w-full border rounded px-3 py-2 mb-3" value={reportReason} onChange={e => setReportReason(e.target.value)} required>
                  <option value="">Select a reason</option>
                  <option value="Spam or scam">Spam or scam</option>
                  <option value="Inappropriate content">Inappropriate content</option>
                  <option value="Fraud or misrepresentation">Fraud or misrepresentation</option>
                  <option value="Other">Other</option>
                </select>
                <label className="block mb-2 font-medium">Details (optional)</label>
                <textarea className="w-full border rounded px-3 py-2 mb-4" rows={3} value={reportDetails} onChange={e => setReportDetails(e.target.value)} placeholder="Add any details..." />
                <div className="flex gap-2 justify-end">
                  <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200" onClick={() => setShowReport(false)}>Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Submit Report</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
