import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchListingById } from '../api/listings';
import { revealUserPhone } from '../api/user';
import { useAuth } from '../context/AuthContext';
import { Heart, HeartOff, MessageCircle, Star, User, CheckCircle, MapPin, ShieldAlert, Share2, Copy, Phone, ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { categories } from '../constants';
import * as LucideIcons from 'lucide-react';
import { useToast } from '../toast/ToastProvider';
import { Button, Card, Container, LoadingSpinner } from '../components/ui';

function ListingDetailsSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        <div className="mb-6 h-10 w-32 bg-white/10 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          {/* Image skeleton */}
          <div className="aspect-square bg-white/10 rounded-2xl animate-pulse" />
          {/* Info skeleton */}
          <div className="space-y-6">
            <div className="h-8 w-2/3 bg-white/20 rounded animate-pulse" />
            <div className="h-6 w-1/3 bg-white/10 rounded animate-pulse" />
            <div className="h-5 w-1/2 bg-white/10 rounded animate-pulse" />
            <div className="h-12 w-full bg-white/10 rounded animate-pulse" />
            <div className="h-12 w-full bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [showDM, setShowDM] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [dmMessages, setDmMessages] = useState<{ from: string; text: string; date: string }[]>([]);
  const [dmInput, setDmInput] = useState('');
  const [reviewInput, setReviewInput] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState(listing?.reviews || [
    { user: 'Alice', rating: 5, comment: 'Great seller!', date: '2024-06-01' },
    { user: 'Bob', rating: 4, comment: 'Smooth transaction.', date: '2024-05-20' },
  ]);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [zoomedImgIdx, setZoomedImgIdx] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const toast = useToast();
  const { user } = useAuth();
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [sellerPhone, setSellerPhone] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const data = await fetchListingById(id);
          setListing(data);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (listing && listing.reviews) setReviews(listing.reviews);
  }, [listing]);

  const handleRevealPhone = async () => {
    if (!user || !user.token) return;
    try {
      const phone = await revealUserPhone(listing.sellerId, user.token);
      setSellerPhone(phone);
      setPhoneRevealed(true);
      toast.addToast('Phone number revealed!', 'success');
    } catch (err) {
      toast.addToast('Not authorized to view phone number', 'error');
    }
  };

  if (loading) {
    return <ListingDetailsSkeleton />;
  }

  if (error) {
    return (
      <Container className="py-16">
        <Card variant="elevated" className="text-center py-16 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Listing</h2>
          <p className="text-white mb-6">{error}</p>
          <Button variant="solid" color="primary" onClick={() => navigate('/')}>
            Go Back Home
          </Button>
        </Card>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container className="py-16">
        <Card variant="elevated" className="text-center py-16 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <X className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Listing Not Found</h2>
          <p className="text-white mb-6">The listing you're looking for doesn't exist or has been removed.</p>
          <Button variant="solid" color="primary" onClick={() => navigate('/')}>
            Browse Other Listings
          </Button>
        </Card>
      </Container>
    );
  }

  // Dummy seller info for now
  const seller = listing.seller || { name: 'Seller Name', profilePic: '', createdAt: '2023-01-01', rating: 4.7, reviews: 12 };

  // Find category icon
  let catIcon = LucideIcons.Circle;
  if (listing.category) {
    const catObj = categories.find(c => c.name === listing.category);
    if (catObj && catObj.icon && (LucideIcons as any)[catObj.icon]) {
      catIcon = (LucideIcons as any)[catObj.icon];
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        {/* Back Button */}
        <Button
          variant="outline"
          color="primary"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
          className="mb-6 animate-fade-in"
        >
          Back
        </Button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          {/* Image Gallery */}
          <Card variant="elevated" className="relative overflow-hidden animate-fade-in">
            {listing.images && listing.images.length > 0 ? (
              <div className="relative">
                {/* Main Image */}
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <img
                    src={listing.images[currentImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={() => setZoomedImgIdx(currentImageIndex)}
                    loading="lazy"
                    onError={e => { e.currentTarget.src = '/fallback-image.png'; }}
                  />
                  
                  {/* Navigation Arrows */}
                  {listing.images.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-none flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-lg border border-white"
                        onClick={() => setCurrentImageIndex((currentImageIndex - 1 + listing.images.length) % listing.images.length)}
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-none flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 shadow-lg border border-white"
                        onClick={() => setCurrentImageIndex((currentImageIndex + 1) % listing.images.length)}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {listing.images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {listing.images.slice(0, 8).map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={listing.title}
                        className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                          idx === currentImageIndex 
                            ? 'border-primary-500 scale-110 shadow-lg' 
                            : 'border-white/30 hover:border-primary-300 hover:scale-105'
                        }`}
                        onClick={() => setCurrentImageIndex(idx)}
                        loading="lazy"
                        onError={e => { e.currentTarget.src = '/fallback-image.png'; }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <X className="w-8 h-8 text-primary-500" />
                  </div>
                  <p className="text-primary-600 font-medium">No Image Available</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                variant={favorite ? "solid" : "outline"}
                color={favorite ? "red" : "primary"}
                icon={favorite ? HeartOff : Heart}
                onClick={() => {
                  setFavorite(f => !f);
                  toast.addToast(favorite ? 'Removed from favorites' : 'Added to favorites', 'success');
                }}
                className="flex-1"
              >
                {favorite ? 'Remove from Favorites' : 'Save to Favorites'}
              </Button>
              
              <Button
                variant="outline"
                color="primary"
                icon={Share2}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.addToast('Link copied to clipboard!', 'success');
                }}
              >
                Share
              </Button>
            </div>
          </Card>

          {/* Listing Info */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {/* Header */}
            <Card variant="elevated" className="animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gradient mb-3 flex items-center gap-2">
                    {listing.title}
                    {listing.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold animate-pulse-glow">
                        <CheckCircle className="w-4 h-4" /> Verified
                      </span>
                    )}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl font-bold text-gradient">${listing.price}</span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      💵 Cash on Delivery
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  color="red"
                  icon={ShieldAlert}
                  onClick={() => setShowReport(true)}
                  className="text-sm"
                >
                  Report
                </Button>
              </div>

              {/* Category & Location */}
              <div className="space-y-3">
                {(listing.category || listing.subcategory) && (
                  <div className="flex items-center gap-2 text-primary-600 text-sm font-medium">
                    <span className="flex items-center gap-1">
                      {listing.category}
                    </span>
                    {listing.subcategory && <span className="text-primary-400">/ {listing.subcategory}</span>}
                  </div>
                )}
                
                {listing.location && (
                  <div className="flex items-center gap-2 text-primary-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold text-primary-700 mb-3">Description</h3>
              <p className="text-primary-600 leading-relaxed">{listing.description}</p>
            </Card>

            {/* Seller Info */}
            <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-semibold text-primary-700 mb-4">Seller Information</h3>
              <div className="flex items-center gap-4">
                <img 
                  src={seller.profilePic || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + seller.name} 
                  alt="Seller" 
                  className="w-16 h-16 rounded-full object-cover border-3 border-primary-200 shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300" 
                  onClick={() => navigate(`/profile/${seller.id}`)} 
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-primary-800 cursor-pointer hover:text-primary-600 transition-colors" onClick={() => navigate(`/profile/${seller.id}`)}>
                      {seller.name}
                    </h4>
                    <User className="w-4 h-4 text-primary-400" />
                  </div>
                  <div className="text-sm text-primary-500 mb-1">
                    Member since {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
                    <Star className="w-4 h-4" /> {seller.rating} ({seller.reviews} reviews)
                  </div>
                  
                  {/* Phone Number */}
                  {user && (user.id === listing.sellerId || user.verified) ? (
                    sellerPhone || listing.sellerPhone ? (
                      <div className="flex items-center gap-2 text-primary-700 font-semibold">
                        <Phone className="w-4 h-4" />
                        <span>{sellerPhone || listing.sellerPhone}</span>
                        <Button
                          variant="ghost"
                          color="primary"
                          icon={Copy}
                          onClick={() => {
                            navigator.clipboard.writeText(sellerPhone || listing.sellerPhone);
                            toast.addToast('Phone number copied!', 'success');
                          }}
                          className="text-xs"
                        >
                          Copy
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        color="primary"
                        icon={Phone}
                        onClick={handleRevealPhone}
                        disabled={phoneRevealed}
                        className="text-sm"
                      >
                        {phoneRevealed ? 'Phone Revealed' : 'Reveal Phone Number'}
                      </Button>
                    )
                  ) : (
                    <div className="text-sm text-primary-500">
                      {user ? 'Only verified users can view phone numbers' : 'Log in to view phone number'}
                    </div>
                  )}
                </div>
                
                <Button
                  variant="solid"
                  color="primary"
                  icon={MessageCircle}
                  onClick={() => setShowDM(true)}
                  className="shadow-lg"
                >
                  Contact
                </Button>
              </div>
            </Card>

            {/* Reviews */}
            <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-700">Reviews</h3>
                <Button
                  variant="outline"
                  color="primary"
                  onClick={() => setShowReview(true)}
                  className="text-sm"
                >
                  Leave Review
                </Button>
              </div>
              
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <div key={i} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className="flex items-center gap-2 mb-2">
                        <img 
                          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${r.user}`} 
                          alt={r.user} 
                          className="w-8 h-8 rounded-full border border-primary-200" 
                        />
                        <span className="font-semibold text-primary-700">{r.user}</span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">{r.rating}</span>
                        </div>
                      </div>
                      <p className="text-primary-600 mb-2">{r.comment}</p>
                      <span className="text-xs text-primary-400">{new Date(r.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Star className="w-8 h-8 text-primary-500" />
                  </div>
                  <p className="text-primary-600">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* DM Modal */}
      {showDM && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card variant="elevated" className="w-full max-w-md mx-4 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={seller.profilePic || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + seller.name} 
                alt="Seller" 
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-300" 
              />
              <div className="font-semibold text-primary-800">{seller.name}</div>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 max-h-60 bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
              {dmMessages.length === 0 ? (
                <div className="text-primary-500 text-center">No messages yet. Say hello!</div>
              ) : (
                dmMessages.map((msg, idx) => (
                  <div key={idx} className={`mb-2 flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}> 
                    <div className={`px-3 py-2 rounded-xl max-w-xs ${
                      msg.from === 'me' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-white/70 backdrop-blur-sm text-primary-700 border border-white/30'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <form className="flex gap-2" onSubmit={e => { 
              e.preventDefault(); 
              if (!dmInput.trim()) return; 
              setDmMessages(msgs => [...msgs, { from: 'me', text: dmInput, date: new Date().toISOString() }]); 
              setDmInput(''); 
            }}>
              <input
                className="flex-1 border border-white/30 rounded-xl px-3 py-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Type your message..."
                value={dmInput}
                onChange={e => setDmInput(e.target.value)}
              />
              <Button type="submit" variant="solid" color="primary">Send</Button>
              <Button type="button" variant="outline" color="primary" onClick={() => setShowDM(false)}>Close</Button>
            </form>
          </Card>
        </div>
      )}

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card variant="elevated" className="w-full max-w-md mx-4 animate-scale-in">
            <h2 className="text-xl font-bold mb-4 text-primary-700">Leave a Review</h2>
            <textarea 
              className="w-full border border-white/30 rounded-xl p-3 mb-4 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
              rows={4} 
              placeholder="Write your review..." 
              value={reviewInput} 
              onChange={e => setReviewInput(e.target.value)} 
            />
            <div className="flex items-center gap-2 mb-4">
              <span className="font-semibold text-primary-700">Rating:</span>
              {[1,2,3,4,5].map(star => (
                <Star 
                  key={star} 
                  className={`w-6 h-6 cursor-pointer transition-colors ${
                    reviewRating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`} 
                  onClick={() => setReviewRating(star)} 
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" color="primary" onClick={() => setShowReview(false)}>Cancel</Button>
              <Button 
                variant="solid" 
                color="primary" 
                onClick={() => {
                  if (!reviewInput.trim()) return;
                  setReviews(revs => [
                    { user: 'You', rating: reviewRating, comment: reviewInput, date: new Date().toISOString() },
                    ...revs
                  ]);
                  setShowReview(false);
                  setReviewInput('');
                  setReviewRating(5);
                  toast.addToast('Review submitted successfully!', 'success');
                }}
              >
                Submit
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card variant="elevated" className="w-full max-w-md mx-4 animate-scale-in">
            <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Report Listing
            </h2>
            <form onSubmit={async e => {
              e.preventDefault();
              if (!reportReason) return toast.addToast('Please select a reason.', 'error');
              try {
                const res = await fetch('/api/report', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                  body: JSON.stringify({ reportedListing: listing._id, reason: reportReason, details: reportDetails }),
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
              <label className="block mb-2 font-medium text-primary-700">Reason</label>
              <select 
                className="w-full border border-white/30 rounded-xl px-3 py-2 mb-3 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                value={reportReason} 
                onChange={e => setReportReason(e.target.value)} 
                required
              >
                <option value="">Select a reason</option>
                <option value="Spam or scam">Spam or scam</option>
                <option value="Inappropriate content">Inappropriate content</option>
                <option value="Fraud or misrepresentation">Fraud or misrepresentation</option>
                <option value="Other">Other</option>
              </select>
              <label className="block mb-2 font-medium text-primary-700">Details (optional)</label>
              <textarea 
                className="w-full border border-white/30 rounded-xl px-3 py-2 mb-4 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400" 
                rows={3} 
                value={reportDetails} 
                onChange={e => setReportDetails(e.target.value)} 
                placeholder="Add any details..." 
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" color="primary" onClick={() => setShowReport(false)}>Cancel</Button>
                <Button type="submit" variant="solid" color="red">Submit Report</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImgIdx !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setZoomedImgIdx(null)}>
          <div className="relative max-w-4xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img
              src={listing.images[zoomedImgIdx]}
              alt={listing.title}
              className="max-h-[80vh] w-auto rounded-2xl shadow-2xl"
              style={{ objectFit: 'contain' }}
              loading="lazy"
              onError={e => { e.currentTarget.src = '/fallback-image.png'; }}
            />
            <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-300" onClick={() => setZoomedImgIdx(null)}>
              <X className="w-6 h-6 text-primary-700" />
            </button>
            {listing.images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all duration-300"
                  onClick={() => setZoomedImgIdx((zoomedImgIdx - 1 + listing.images.length) % listing.images.length)}
                >
                  <ChevronLeft className="w-6 h-6 text-primary-700" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all duration-300"
                  onClick={() => setZoomedImgIdx((zoomedImgIdx + 1) % listing.images.length)}
                >
                  <ChevronRight className="w-6 h-6 text-primary-700" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}