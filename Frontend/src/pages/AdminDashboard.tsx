import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Container, Button, LoadingSpinner } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket';
import { Shield, Users, Package, AlertTriangle, Sparkles, TrendingUp, Eye, Trash2, Crown, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../toast/ToastProvider';

function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-6xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        {/* Header skeleton */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 animate-pulse" />
          <div className="h-8 w-1/2 bg-white/20 rounded mx-auto mb-3 animate-pulse" />
          <div className="h-5 w-1/3 bg-white/10 rounded mx-auto mb-2 animate-pulse" />
        </div>
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 bg-white/10 rounded-xl animate-pulse text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 animate-pulse" />
              <div className="h-8 w-1/2 bg-white/20 rounded mx-auto mb-2 animate-pulse" />
              <div className="h-4 w-1/3 bg-white/10 rounded mx-auto animate-pulse" />
            </div>
          ))}
        </div>
        {/* Table/list skeleton */}
        <div className="space-y-4 animate-fade-in">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-white/10 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user, token } = useAuth();
  const [tab, setTab] = useState<'users' | 'listings' | 'reports'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [openReports, setOpenReports] = useState(0);
  const [showReportInfo, setShowReportInfo] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!(user as any)?.isAdmin) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        if (tab === 'users') {
          const res = await fetch('/api/user/admin/users', { headers: { Authorization: `Bearer ${token}` } });
          setUsers(await res.json());
        } else if (tab === 'listings') {
          const res = await fetch('/api/listings/admin/listings', { headers: { Authorization: `Bearer ${token}` } });
          setListings(await res.json());
        } else if (tab === 'reports') {
          const res = await fetch('/api/report', { headers: { Authorization: `Bearer ${token}` } });
          setReports(await res.json());
          setOpenReports(reports.filter(r => r.status === 'open').length);
        }
      } catch {
        setUsers([]); setListings([]); setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab, token, user, refresh]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    const onNewReport = () => {
      setOpenReports(c => c + 1);
      toast.addToast('New report received!', 'info');
    };
    const onReportClosed = () => {
      setOpenReports(c => Math.max(0, c - 1));
      toast.addToast('Report closed successfully', 'success');
    };
    socket.on('new_report', onNewReport);
    socket.on('report_closed', onReportClosed);
    return () => {
      socket.off('new_report', onNewReport);
      socket.off('report_closed', onReportClosed);
    };
  }, [user, toast]);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await fetch(`/api/user/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setRefresh(r => r + 1);
      toast.addToast('User deleted successfully', 'success');
    } catch {
      toast.addToast('Failed to delete user', 'error');
    }
  };

  const handlePromoteUser = async (id: string, isAdmin: boolean) => {
    try {
      await fetch(`/api/user/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isAdmin: !isAdmin })
      });
      setRefresh(r => r + 1);
      toast.addToast(`User ${isAdmin ? 'demoted' : 'promoted'} successfully`, 'success');
    } catch {
      toast.addToast('Failed to update user', 'error');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await fetch(`/api/listings/admin/listings/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setRefresh(r => r + 1);
      toast.addToast('Listing deleted successfully', 'success');
    } catch {
      toast.addToast('Failed to delete listing', 'error');
    }
  };

  const handlePromoteListing = async (id: string, promoted: boolean) => {
    try {
      await fetch(`/api/listings/admin/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ promoted: !promoted })
      });
      setRefresh(r => r + 1);
      toast.addToast(`Listing ${promoted ? 'unpromoted' : 'promoted'} successfully`, 'success');
    } catch {
      toast.addToast('Failed to update listing', 'error');
    }
  };

  const handleCloseReport = async (id: string) => {
    if (!window.confirm('Close this report?')) return;
    try {
      await fetch(`/api/report/${id}/close`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
      setRefresh(r => r + 1);
      toast.addToast('Report closed successfully', 'success');
    } catch {
      toast.addToast('Failed to close report', 'error');
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-fade-in">
        <Card variant="elevated" className="text-center py-16 animate-scale-in">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-primary-600 mb-6">This area is restricted to administrators only.</p>
          <Button variant="solid" color="primary" onClick={() => navigate('/')}>
            Go Back Home
          </Button>
        </Card>
      </div>
    );
  }

  const stats = {
    users: users.length,
    listings: listings.length,
    openReports: openReports,
    totalReports: reports.length
  };

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#101624] via-[#1a2236] to-[#0a0e17]">
      <div className="max-w-6xl w-full mx-auto p-8 glass-strong rounded-3xl shadow-xl border border-blue-700 bg-[#23272f]/80 backdrop-blur-xl text-white animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl animate-pulse-glow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-3">Admin Dashboard</h1>
          <p className="text-primary-600 text-lg">Manage users, listings, and reports</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="w-5 h-5 text-accent-500" />
            <span className="text-sm text-primary-500 font-medium">Real-time monitoring</span>
            <Sparkles className="w-5 h-5 text-accent-500" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card variant="elevated" className="p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary-700">{stats.users}</div>
            <div className="text-primary-600 text-sm">Total Users</div>
          </Card>
          
          <Card variant="elevated" className="p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary-700">{stats.listings}</div>
            <div className="text-primary-600 text-sm">Total Listings</div>
          </Card>
          
          <Card variant="elevated" className="p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary-700">{stats.openReports}</div>
            <div className="text-primary-600 text-sm">Open Reports</div>
          </Card>
          
          <Card variant="elevated" className="p-6 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary-700">{stats.totalReports}</div>
            <div className="text-primary-600 text-sm">Total Reports</div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <Card variant="elevated" className="mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex gap-2 p-2 bg-white/20 rounded-xl">
            <Button 
              variant={tab === 'users' ? 'solid' : 'outline'} 
              color="primary"
              icon={Users}
              onClick={() => setTab('users')}
              className="flex-1"
            >
              Users ({stats.users})
            </Button>
            <Button 
              variant={tab === 'listings' ? 'solid' : 'outline'} 
              color="primary"
              icon={Package}
              onClick={() => setTab('listings')}
              className="flex-1"
            >
              Listings ({stats.listings})
            </Button>
            <div className="relative flex-1">
              <Button 
                variant={tab === 'reports' ? 'solid' : 'outline'} 
                color="primary"
                icon={AlertTriangle}
                onClick={() => setTab('reports')}
                className="w-full"
              >
                Reports ({stats.totalReports})
                {openReports > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold animate-pulse">
                    {openReports}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Report Info Banner */}
        {tab === 'reports' && showReportInfo && (
          <Card variant="elevated" className="mb-6 animate-fade-in border-l-4 border-blue-500" style={{ animationDelay: '0.3s' }}>
            <div className="p-4 bg-blue-50/50 backdrop-blur-sm relative">
              <button 
                onClick={() => setShowReportInfo(false)} 
                className="absolute top-2 right-2 text-blue-400 hover:text-blue-700 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
              <div className="font-semibold mb-2 text-blue-700">How Reporting & Moderation Works</div>
              <ul className="list-disc pl-5 text-sm space-y-1 text-blue-600">
                <li>Users can report listings or users for review. Reports appear here in real time.</li>
                <li>The red badge shows the number of open (unresolved) reports. It updates instantly as reports are created or closed.</li>
                <li>Admins receive toast notifications for new and closed reports.</li>
                <li>Click "Close" to resolve a report. This will notify all admins and update the badge.</li>
                <li>Click user or listing names to view more details before taking action.</li>
              </ul>
            </div>
          </Card>
        )}

        {/* Content Tables */}
        <Card variant="elevated" className="overflow-hidden animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="overflow-x-auto">
            {tab === 'users' ? (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-white/30 backdrop-blur-sm">
                    <th className="p-4 text-left font-semibold text-primary-700">Name</th>
                    <th className="p-4 text-left font-semibold text-primary-700">Email</th>
                    <th className="p-4 text-left font-semibold text-primary-700">Admin</th>
                    <th className="p-4 text-left font-semibold text-primary-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr key={u._id} className="border-b border-white/20 hover:bg-white/10 transition-colors duration-200 animate-fade-in" style={{ animationDelay: `${0.5 + index * 0.05}s` }}>
                      <td className="p-4 font-medium text-primary-700">{u.name}</td>
                      <td className="p-4 text-primary-600">{u.email}</td>
                      <td className="p-4">
                        {(u as any).isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                            <Crown className="w-3 h-3" /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            <Users className="w-3 h-3" /> User
                          </span>
                        )}
                      </td>
                      <td className="p-4 flex gap-2">
                        <Button 
                          size="sm" 
                          color={(u as any).isAdmin ? 'secondary' : 'primary'} 
                          variant="outline" 
                          icon={(u as any).isAdmin ? Crown : Users}
                          onClick={() => handlePromoteUser(u._id, (u as any).isAdmin)}
                        >
                          {(u as any).isAdmin ? 'Demote' : 'Promote'}
                        </Button>
                        <Button 
                          size="sm" 
                          color="red" 
                          variant="outline"
                          icon={Trash2}
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : tab === 'listings' ? (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-white/30 backdrop-blur-sm">
                    <th className="p-4 text-left font-semibold text-primary-700">Title</th>
                    <th className="p-4 text-left font-semibold text-primary-700">Price</th>
                    <th className="p-4 text-left font-semibold text-primary-700">Promoted</th>
                    <th className="p-4 text-left font-semibold text-primary-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l, index) => (
                    <tr key={l._id} className="border-b border-white/20 hover:bg-white/10 transition-colors duration-200 animate-fade-in" style={{ animationDelay: `${0.5 + index * 0.05}s` }}>
                      <td className="p-4 font-medium text-primary-700">{l.title}</td>
                      <td className="p-4 text-primary-600">${l.price}</td>
                      <td className="p-4">
                        {l.promoted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            <Star className="w-3 h-3" /> Promoted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            <Package className="w-3 h-3" /> Regular
                          </span>
                        )}
                      </td>
                      <td className="p-4 flex gap-2">
                        <Button 
                          size="sm" 
                          color={l.promoted ? 'secondary' : 'primary'} 
                          variant="outline"
                          icon={l.promoted ? Star : TrendingUp}
                          onClick={() => handlePromoteListing(l._id, l.promoted)}
                        >
                          {l.promoted ? 'Unpromote' : 'Promote'}
                        </Button>
                        <Button 
                          size="sm" 
                          color="red" 
                          variant="outline"
                          icon={Trash2}
                          onClick={() => handleDeleteListing(l._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-white/30 backdrop-blur-sm">
                    <th className="p-4 text-left font-semibold text-primary-700">Reporter</th>
                    <th className="p-4 text-left font-semibold text-primary-700">Reported</th>
                    <th className="p-4 text-left font-semibold text-primary-700">Reason</th>
                    <th className="p-4 text-left font-semibold text-primary-700">Details</th>
                    <th className="p-4 text-left font-semibold text-primary-700">Status</th>
                    <th className="p-4 text-left font-semibold text-primary-700">Created</th>
                    <th className="p-4 text-left font-semibold text-primary-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, index) => (
                    <tr key={r._id} className="border-b border-white/20 hover:bg-white/10 transition-colors duration-200 animate-fade-in" style={{ animationDelay: `${0.5 + index * 0.05}s` }}>
                      <td className="p-4">
                        {r.reporter?.name ? (
                          <button 
                            className="text-primary-600 underline hover:text-primary-700 transition-colors"
                            onClick={() => navigate(`/profile/${r.reporter._id || r.reporter.id || r.reporter}`)}
                          >
                            {r.reporter.name}
                          </button>
                        ) : (
                          r.reporter
                        )}
                      </td>
                      <td className="p-4">
                        {r.reportedUser ? (
                          <button 
                            className="text-primary-600 underline hover:text-primary-700 transition-colors"
                            onClick={() => navigate(`/profile/${r.reportedUser._id || r.reportedUser.id || r.reportedUser}`)}
                          >
                            {r.reportedUser.name || r.reportedUser}
                          </button>
                        ) : r.reportedListing ? (
                          <button 
                            className="text-primary-600 underline hover:text-primary-700 transition-colors"
                            onClick={() => navigate(`/listing/${r.reportedListing._id || r.reportedListing.id || r.reportedListing}`)}
                          >
                            {r.reportedListing.title || r.reportedListing}
                          </button>
                        ) : (
                          r.reportedUser || r.reportedListing
                        )}
                      </td>
                      <td className="p-4 text-primary-600">{r.reason}</td>
                      <td className="p-4 text-primary-600 max-w-xs truncate">{r.details}</td>
                      <td className="p-4">
                        {r.status === 'open' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            <AlertTriangle className="w-3 h-3" /> Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            <CheckCircle className="w-3 h-3" /> Closed
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-primary-600 text-xs">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                      </td>
                      <td className="p-4">
                        {r.status === 'open' && (
                          <Button 
                            size="sm" 
                            color="green" 
                            variant="outline"
                            icon={CheckCircle}
                            onClick={() => handleCloseReport(r._id)}
                          >
                            Close
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard; 