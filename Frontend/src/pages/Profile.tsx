import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trash2, Edit, LogOut, User, KeyRound, PlusCircle, Camera, Star, StarOff, Copy, Download, Settings, Bell } from 'lucide-react';
import { deleteUser, updateUser, fetchUser } from '../api/user';
import { deleteListing, updateListing } from '../api/listings';
import { uploadImages } from '../api/upload';
import { useToast } from '../toast/ToastProvider';
import { Button, Input, Card, Container } from '../components/ui';
import ListingCard from '../components/ListingCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-8 glass-strong shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in rounded-xl">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-white/20 animate-pulse" />
        <div className="flex-1 space-y-4">
          <div className="h-8 w-1/2 bg-white/20 rounded animate-pulse" />
          <div className="h-5 w-1/3 bg-white/10 rounded animate-pulse" />
          <div className="h-5 w-1/4 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-3 w-full bg-white/10 rounded mb-4 animate-pulse" />
      <div className="h-3 w-2/3 bg-white/10 rounded mb-8 animate-pulse" />
      <div className="h-12 w-full bg-white/10 rounded mb-4 animate-pulse" />
      <div className="h-12 w-full bg-white/10 rounded mb-4 animate-pulse" />
      <div className="h-12 w-full bg-white/10 rounded mb-4 animate-pulse" />
    </div>
  );
}

export default function Profile() {
  const { user, logout, token, setUser } = useAuth();
  console.log('Profile page user context:', user);
  const { listings, refresh } = useListings();
  const [tab, setTab] = useState('profile');
  const [editData, setEditData] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', bio: user?.bio || '' });
  const [profilePic, setProfilePic] = useState<string | undefined>(user?.profilePic);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'user' | 'listing'; id?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const toast = useToast();
  const navigate = useNavigate();
  const query = useQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });
  const followedSellers = [
    { id: 'seller1', name: 'Jane Seller' },
    { id: 'seller2', name: 'John Tech' },
  ];
  const [deleteModalRect, setDeleteModalRect] = useState<DOMRect | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [pendingProfilePic, setPendingProfilePic] = useState<string | undefined>(undefined);
  const [pendingEditData, setPendingEditData] = useState<typeof editData | null>(null);

  useEffect(() => {
    const t = query.get('tab');
    if (t) setTab(t);
  }, [query]);

  useEffect(() => {
    setEditData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', bio: user?.bio || '' });
    setProfilePic(user?.profilePic);
  }, [user]);

  const userListings = listings.filter(l => l.sellerId === user?.id);

  // Profile completion calculation
  const completion = [user?.name, user?.email, user?.phone, user?.profilePic, user?.bio].filter(Boolean).length / 5 * 100;

  const handleTab = (t: string) => {
    setTab(t);
    navigate(`/profile?tab=${t}`);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
      // Preview
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Save pending changes and show password modal
    setPendingProfilePic(profilePic);
    setPendingEditData(editData);
    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = async () => {
    if (!user?.id) {
      toast.addToast('User ID is missing. Please log in again.', 'error');
      setLoading(false);
      setShowPasswordModal(false);
      setCurrentPassword('');
      return;
    }
    setLoading(true);
    try {
      let picUrl = pendingProfilePic;
      if (profilePicFile) {
        const uploaded = await uploadImages([profilePicFile]);
        picUrl = uploaded[0];
      }
      await updateUser(user.id, { ...pendingEditData, profilePic: picUrl, currentPassword }, token || undefined);
      // Forced refetch of user data
      const freshUser = await fetchUser(user.id, token || undefined);
      setUser({ ...(freshUser as any), id: (freshUser as any).id || (freshUser as any)._id, verified: (freshUser as any).verified ?? false });
      localStorage.setItem('user', JSON.stringify({ ...(freshUser as any), id: (freshUser as any).id || (freshUser as any)._id, verified: (freshUser as any).verified ?? false }));
      setProfilePic(freshUser.profilePic); // Ensure UI shows the latest profile picture
      toast.addToast('Profile updated!', 'success');
      setProfilePicFile(null);
      setShowPasswordModal(false);
      setCurrentPassword('');
    } catch (err: any) {
      toast.addToast(err?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      await deleteUser();
      toast.addToast('Account deleted', 'success');
      logout();
      setShowDeleteModal(false);
      navigate('/');
    } catch (err: any) {
      toast.addToast(err?.message || 'Delete failed', 'error');
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    setLoading(true);
    try {
      await deleteListing(id);
      toast.addToast('Listing deleted', 'success');
      refresh();
    } catch (err: any) {
      toast.addToast(err?.message || 'Delete failed', 'error');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handlePromoteListing = async (id: string, promoted: boolean) => {
    setLoading(true);
    try {
      await updateListing(id, { promoted }, token || '');
      toast.addToast(promoted ? 'Listing promoted!' : 'Promotion removed.', 'success');
      refresh();
    } catch (err: any) {
      toast.addToast(err?.message || 'Failed to update promotion', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/profile/' + user?.id);
    toast.addToast('Profile link copied!', 'info');
  };

  // UI for each tab
  const renderTab = () => {
    if (tab === 'profile') {
      // Debug: log the profile picture URL
      console.log('ProfilePic:', user?.profilePic);
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img
                src={user?.profilePic || '/fallback-image.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary-400 shadow-xl"
              />
            </div>
            <div>
              <div className="text-2xl font-bold flex items-center gap-3 text-primary-700">
                {user?.name}
                <button
                  onClick={handleCopyProfileLink}
                  title="Copy profile link"
                  className="p-2 rounded-full hover:bg-primary-100 transition-colors"
                >
                  <Copy className="w-5 h-5 text-white hover:text-white" />
                </button>
              </div>
              <div className="text-white">{user?.email}</div>
              <div className="text-white">{user?.phone}</div>
              <div className="text-white text-sm mt-2">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-full bg-accent-100/30 rounded-full h-3">
              <div className={`h-3 rounded-none transition-all duration-500 bg-gradient-to-r from-white/60 to-white/90`} style={{ width: `${completion}%` }}></div>
            </div>
            <div className="text-sm text-white flex items-center gap-2">
              <span>Profile completion: {Math.round(completion)}%</span>
              {completion >= 80 && <span className="text-white">✓ Complete</span>}
              {completion >= 60 && completion < 80 && <span className="text-white">✓ Good</span>}
              {completion >= 40 && completion < 60 && <span className="text-white">⚠ Needs work</span>}
              {completion < 40 && <span className="text-white">⚠ Incomplete</span>}
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-semibold text-primary-700 text-lg">About Me</div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 min-h-[60px] border border-white/30 font-bold text-white">
              {user?.bio || <span className="text-primary-400 italic">No bio yet.</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              icon={Edit}
              onClick={() => handleTab('edit')}
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              icon={PlusCircle}
              onClick={() => handleTab('listings')}
            >
              My Listings
            </Button>
            <Button
              variant="ghost"
              icon={Download}
              onClick={() => toast.addToast('Download not implemented yet', 'info')}
            >
              Download Data
            </Button>
          </div>
        </div>
      );
    }

    if (tab === 'edit') {
      return (
        <>
          <form className="space-y-6" onSubmit={handleProfileUpdate}>
            <div className="flex items-center gap-6">
              <img
                src={profilePic || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + user?.id}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-3 border-primary-400 shadow-lg"
              />
              <Button
                type="button"
                variant="outline"
                icon={Camera}
                onClick={() => fileInputRef.current?.click()}
              >
                Change Picture
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </div>

            <Input
              label="Name"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={editData.email}
              onChange={handleEditChange}
              required
            />

            <Input
              label="Phone"
              name="phone"
              value={editData.phone}
              onChange={handleEditChange}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary-700">Bio</label>
              <textarea
                name="bio"
                value={editData.bio}
                onChange={handleEditChange}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 min-h-[100px] resize-none"
                maxLength={200}
                placeholder="Tell us about yourself..."
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-[#181A20] rounded-xl p-8 shadow-xl w-full max-w-sm border border-primary-900">
                <h2 className="text-lg font-bold mb-4 text-primary-400">Confirm Your Password</h2>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-primary-400 rounded mb-6 text-lg text-white bg-[#23272f] focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-primary-300"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => { setShowPasswordModal(false); setCurrentPassword(''); }}
                    variant="outline"
                    className="font-semibold px-6 py-2 text-white border border-primary-400 bg-[#181A20] hover:bg-[#23272f] focus:bg-[#23272f]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePasswordConfirm}
                    loading={loading}
                    disabled={!currentPassword}
                    className={`font-bold px-6 py-2 border border-primary-400 bg-[#23272f] text-white ${!currentPassword ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#181A20] focus:bg-[#181A20]'}`}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    if (tab === 'password') {
      return (
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); toast.addToast('Password change not implemented.', 'info'); }}>
          <Input
            label="Current Password"
            type="password"
            value={passwords.current}
            onChange={e => setPasswords({ ...passwords, current: e.target.value })}
            required
          />

          <Input
            label="New Password"
            type="password"
            value={passwords.new}
            onChange={e => setPasswords({ ...passwords, new: e.target.value })}
            required
          />

          <Button type="submit" className="w-full">
            Change Password
          </Button>
        </form>
      );
    }

    if (tab === 'listings') {
      return (
        <div className="space-y-6">
          <Button
            className="w-full sm:w-auto"
            icon={PlusCircle}
            onClick={() => navigate('/add')}
          >
            Add New Listing
          </Button>

          {userListings.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2 text-primary-700">No listings yet</h3>
              <p className="text-primary-500">Start by creating your first listing!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {userListings.map(listing => (
                <div
                  key={listing.id}
                  className="mb-6"
                  ref={el => { cardRefs.current[listing.id] = el; }}
                >
                  <ListingCard
                    id={listing.id}
                    title={listing.title}
                    price={listing.price.toString()}
                    image={listing.images && listing.images.length > 0 ? listing.images[0] : undefined}
                    category={listing.category}
                    subcategory={listing.subcategory}
                    location={listing.location}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="solid"
                      color={listing.promoted ? "orange" : "secondary"}
                      size="sm"
                      icon={listing.promoted ? StarOff : Star}
                      onClick={() => handlePromoteListing(listing.id, !listing.promoted)}
                      title={listing.promoted ? 'Remove Promotion' : 'Promote'}
                    >
                      {listing.promoted ? 'Unpromote' : 'Promote'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => navigate(`/edit/${listing.id}`)}
                      title="Edit"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="solid"
                      color="red"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDeleteListing(listing.id)}
                      title="Delete"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (tab === 'delete') {
      return (
        <div className="space-y-6">
          <div className="text-red-600 font-bold text-xl flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Danger Zone
          </div>
          <Card variant="outlined" className="border-red-300/50 bg-gradient-to-r from-red-50/20 to-red-100/20">
            <div className="text-center space-y-4">
              <div className="text-6xl">🗑️</div>
              <h3 className="text-xl font-semibold text-red-600">Delete Account</h3>
              <p className="text-accent-600">This action cannot be undone. All your data will be permanently deleted.</p>
              <Button
                variant="solid"
                color="red"
                icon={Trash2}
                onClick={() => { setDeleteTarget({ type: 'user' }); setShowDeleteModal(true); }}
              >
                Delete My Account
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    if (tab === 'settings') {
      return (
        <div className="space-y-8">
          <div>
            <div className="font-semibold text-primary-700 text-lg mb-4">Notification Preferences</div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={e => setSettings(s => ({ ...s, emailNotifications: e.target.checked }))}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-primary-700">Email Notifications</div>
                  <div className="text-sm text-primary-500">Receive updates via email</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={e => setSettings(s => ({ ...s, pushNotifications: e.target.checked }))}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-primary-700">Push Notifications</div>
                  <div className="text-sm text-primary-500">Receive browser notifications</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <div className="font-semibold text-primary-700 text-lg mb-4">Followed Sellers</div>
            <div className="space-y-3">
              {followedSellers.length === 0 ? (
                <div className="text-center py-8 text-primary-500">
                  <div className="text-4xl mb-2">👥</div>
                  <p>You are not following any sellers yet.</p>
                </div>
              ) : (
                followedSellers.map(seller => (
                  <Card key={seller.id} className="flex items-center justify-between">
                    <span className="font-semibold text-primary-700">{seller.name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {}}
                    >
                      Unfollow
                    </Button>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading || !user) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-4xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
      {/* Glassy Tab Bar */}
      <div className="flex gap-2 mb-8 rounded-2xl bg-white/20 backdrop-blur-xl shadow-xl p-3 justify-center items-center sticky top-28 z-10 border border-white/30">
        {[
          { key: 'profile', label: 'Profile', icon: <User className="w-4 h-4" />, color: 'primary' },
          { key: 'edit', label: 'Edit', icon: <Edit className="w-4 h-4" />, color: 'secondary' },
          { key: 'password', label: 'Password', icon: <KeyRound className="w-4 h-4" />, color: 'accent' },
          { key: 'listings', label: 'Listings', icon: <PlusCircle className="w-4 h-4" />, color: 'blush' },
          { key: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, color: 'neutral' },
          { key: 'delete', label: 'Delete', icon: <Trash2 className="w-4 h-4" />, color: 'red' },
        ].map(tabItem => {
          const getGradient = (color: string) => {
            switch(color) {
              case 'primary': return 'from-primary-500 to-primary-600';
              case 'secondary': return 'from-secondary-500 to-secondary-600';
              case 'accent': return 'from-accent-500 to-accent-600';
              case 'blush': return 'from-blush-500 to-blush-600';
              case 'neutral': return 'from-neutral-400 to-neutral-600';
              case 'red': return 'from-red-500 to-red-600';
              default: return 'from-primary-500 to-secondary-500';
            }
          };

          return (
            <button
              key={tabItem.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 relative
                ${tab === tabItem.key
                  ? `bg-gradient-to-r ${getGradient(tabItem.color)} text-white shadow-lg scale-105`
                  : 'bg-white/10 text-primary-700 hover:bg-primary-100/50'
                }
              `}
              onClick={() => handleTab(tabItem.key)}
            >
              {tabItem.icon} {tabItem.label}
              {tab === tabItem.key && (
                <span className="absolute left-2 right-2 -bottom-1 h-1 rounded-full bg-white/60 animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <Card variant="elevated" className="animate-fade-in">
        {renderTab()}
      </Card>
      </div>
    </div>
  );
}
