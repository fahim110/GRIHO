import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Building,
  Heart,
  Calendar,
  MessageCircle,
  PlusCircle,
  ShieldCheck,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  Calculator,
  ExternalLink,
  Compass,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchMyListings,
  fetchMyInquiries,
  fetchUserProfile,
  updatePropertyStatus,
  updateInquiryStatus,
  fetchProperties,
} from '../api';
import PropertyVisual from '../components/PropertyVisual';

export default function DashboardPage({ onOpenPostModal, onOpenLease, onOpenCalculator }) {
  const { user, token, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'listings' | 'inquiries' | 'saved' | 'profile'
  const [myListings, setMyListings] = useState([]);
  const [myInquiries, setMyInquiries] = useState([]);
  const [savedFlats, setSavedFlats] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    nidNumber: '',
    role: 'tenant',
  });

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!token && !loading) {
      navigate('/login');
    }
  }, [token, loading, navigate]);

  // Load dashboard data
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [profileRes, listingsRes, inqRes, propsRes] = await Promise.all([
          fetchUserProfile(token).catch(() => ({ success: false })),
          fetchMyListings(token).catch(() => ({ success: false, data: [] })),
          fetchMyInquiries(token).catch(() => ({ success: false, data: [] })),
          fetchProperties().catch(() => ({ success: false, data: [] })),
        ]);

        if (profileRes.success && profileRes.user) {
          setEditForm({
            name: profileRes.user.name || '',
            phone: profileRes.user.phone || '',
            nidNumber: profileRes.user.nidNumber || '',
            role: profileRes.user.role || 'tenant',
          });

          if (profileRes.user.savedProperties) {
            setSavedFlats(profileRes.user.savedProperties);
          }
        }

        if (listingsRes.success && listingsRes.data) {
          setMyListings(listingsRes.data);
        }

        if (inqRes.success && inqRes.data) {
          setMyInquiries(inqRes.data);
        }

        if (propsRes.success && propsRes.data) {
          setFeaturedProperties(propsRes.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    try {
      await updateProfile(editForm);
      setProfileMessage({ type: 'success', text: '✅ Profile updated successfully! NID status verified.' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleTogglePropertyStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Available' ? 'Booked' : 'Available';
    try {
      const res = await updatePropertyStatus(id, nextStatus, token);
      if (res.success) {
        setMyListings((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: nextStatus } : item))
        );
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const res = await updateInquiryStatus(inquiryId, newStatus, token);
      if (res.success) {
        setMyInquiries((prev) =>
          prev.map((inq) => (inq._id === inquiryId ? { ...inq, status: newStatus } : inq))
        );
      }
    } catch (e) {
      console.error('Failed to update inquiry status', e);
    }
  };

  const formatBDT = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-stretch font-sans text-xs sm:text-sm">
      
      {/* Top Compact Dashboard Header (~75% proportion) */}
      <header className="w-full border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Tag */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-white tracking-tight">GRIHO</span>
                <span className="font-bengali text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/30">ড্যাশবোর্ড</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {user?.role === 'landlord' ? '🏢 Landlord Property Hub' : '🏠 Tenant Living Hub & Services'}
              </p>
            </div>
          </Link>

          {/* Right Header Navigation Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Explore Verified Flats</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/80 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Dashboard Body (~75% scale compact layout) */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 space-y-6">
        
        {/* ========================================================= */}
        {/* 1. USER PROFILE BANNER & METRICS */}
        {/* ========================================================= */}
        <div className="glass-panel-glow rounded-2xl p-5 sm:p-6 lg:p-7 border border-slate-700/80 backdrop-blur-xl shadow-xl space-y-5">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-5 border-b border-slate-800/80">
            
            {/* User Avatar & Info */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-2xl sm:text-3xl shadow-lg shadow-emerald-500/20 shrink-0 border border-emerald-400/40">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{user?.name || 'Welcome Member'}</h1>
                  <span className={`text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                    user?.role === 'landlord'
                      ? 'bg-sky-950/90 text-sky-300 border-sky-500/40'
                      : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {user?.role === 'landlord' ? '🏢 Verified Landlord' : '🏠 Verified Tenant'}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    {user?.email}
                  </span>
                  {user?.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-400" />
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* NID Status Badge with Action */}
            <div className="flex items-center gap-3 bg-slate-950/90 p-3.5 sm:p-4 rounded-xl border border-slate-800 shadow-md">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                user?.nidVerified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{user?.nidVerified ? 'NID Verified Citizen' : 'National ID (NID) Status'}</span>
                  {user?.nidVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-[11px] text-slate-400">
                  {user?.nidVerified
                    ? 'Trusted Account • Verified Security Badge Active'
                    : 'Add 10/17 digit NID to unlock Verified badge'}
                </div>
                {!user?.nidVerified && (
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer inline-block"
                  >
                    Verify NID in Profile Tab →
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* 4 Metric Summary Cards (~75% compact) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between shadow-md hover:border-slate-700 transition-all">
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saved Homes</div>
                <div className="text-2xl sm:text-3xl font-black text-rose-400">{savedFlats.length}</div>
                <div className="text-[11px] text-slate-400 font-medium">Bookmarked homes</div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between shadow-md hover:border-slate-700 transition-all">
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tour Inquiries</div>
                <div className="text-2xl sm:text-3xl font-black text-sky-400">{myInquiries.length}</div>
                <div className="text-[11px] text-slate-400 font-medium">Visits scheduled</div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-sky-400" />
              </div>
            </div>

            {user?.role === 'landlord' ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between shadow-md hover:border-slate-700 transition-all">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">My Listings</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">{myListings.length}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Active properties listed</div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between shadow-md hover:border-slate-700 transition-all">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Direct Connects</div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-400">Unlimited</div>
                  <div className="text-[11px] text-slate-400 font-medium">Free WhatsApp direct chat</div>
                </div>
                <div className="w-11 h-11 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-teal-400" />
                </div>
              </div>
            )}

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between shadow-md hover:border-slate-700 transition-all">
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Brokerage Fee</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">৳ 0</div>
                <div className="text-[11px] text-slate-400 font-medium">100% Free peer-to-peer</div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. COMPACT NAVIGATION TABS */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 overflow-x-auto shadow-md">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>📊 Overview & Shortcuts</span>
          </button>

          {user?.role === 'landlord' && (
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'listings'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>🏢 My Listings ({myListings.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>📅 Tour Inquiries ({myInquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>❤️ Saved Homes ({savedFlats.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>👤 Profile & NID Verification</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & SHORTCUTS */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Quick Action Cards */}
            <div className="space-y-3.5">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">Quick Tools & Features</h2>
                <p className="text-xs sm:text-sm text-slate-400">Instant services to search, lease, calculate, and post rental properties</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Action 1: Post Property */}
                <div
                  onClick={() => {
                    if (onOpenPostModal) onOpenPostModal();
                  }}
                  className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <PlusCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base">Post a Free Listing</h3>
                      <p className="text-xs text-slate-400">List flat, sublet, or room in Dhaka & CTG</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-800/60">
                    <span>Create Listing Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Action 2: Tenancy Agreement */}
                <div
                  onClick={() => {
                    if (onOpenLease) onOpenLease();
                  }}
                  className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base">Tenancy Agreement Helper</h3>
                      <p className="text-xs text-slate-400">Bangla rental contract (ভাড়া চুক্তিপত্র)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-800/60">
                    <span>Generate চুক্তিপত্র</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Action 3: Budget Calculator */}
                <div
                  onClick={() => {
                    if (onOpenCalculator) onOpenCalculator();
                  }}
                  className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-sky-500/60 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base">Affordability Calculator</h3>
                      <p className="text-xs text-slate-400">Calculate 30% safe monthly rent by salary</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-800/60">
                    <span>Calculate Budget</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            </div>

            {/* Recent Tour Visits & Inquiries Section */}
            <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">Recent Tour Visits & Inquiries</h3>
                  <p className="text-xs text-slate-400">Track physical visit confirmations and contact numbers</p>
                </div>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  View All ({myInquiries.length}) →
                </button>
              </div>

              {myInquiries.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Tour Inquiries Scheduled Yet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Browse verified flats on GRIHO and click "Schedule Tour" to request direct in-person apartment visits.
                  </p>
                  <Link
                    to="/"
                    className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-md mt-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Explore Flats to Book Tours</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myInquiries.slice(0, 3).map((inq) => (
                    <div
                      key={inq._id}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-white">{inq.propertyTitle}</div>
                        <div className="text-xs text-slate-400">
                          Applicant: <strong className="text-slate-200">{inq.name}</strong> ({inq.tenantType}) • Phone: <strong className="text-slate-200">{inq.phone}</strong>
                        </div>
                        {inq.preferredVisitDate && (
                          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Preferred: {inq.preferredVisitDate} {inq.preferredVisitTime ? `at ${inq.preferredVisitTime}` : ''}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          inq.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                            : inq.status === 'Scheduled'
                            ? 'bg-sky-950 text-sky-300 border-sky-500/40'
                            : 'bg-amber-950 text-amber-300 border-amber-500/40'
                        }`}>
                          {inq.status}
                        </span>
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended / Explore Flats Section on Dashboard */}
            {featuredProperties.length > 0 && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">Recommended Verified Flats</h3>
                    <p className="text-xs text-slate-400">Direct from verified owners in Dhaka & Chittagong</p>
                  </div>
                  <Link
                    to="/"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Full Marketplace</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredProperties.slice(0, 4).map((p) => (
                    <div key={p._id} className="glass-panel rounded-2xl p-3.5 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 shadow-md">
                      <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-800">
                        <PropertyVisual property={p} aspect="aspect-[16/10]" showBadges={false} className="h-full p-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-black text-emerald-400">৳{formatBDT(p.rent)}<span className="text-[10px] text-slate-400 font-normal">/mo</span></span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {p.bedrooms} Beds
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-xs line-clamp-1">{p.title}</h4>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{p.area}, {p.city}</span>
                        </div>
                      </div>
                      <Link
                        to="/"
                        className="btn-secondary w-full py-1.5 rounded-xl text-xs font-bold text-center block"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bangladesh Rental Guidelines & Security Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Titas Gas Verification</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verify pipeline gas connections with the property owner before moving. Look for the Titas Line Gas badge on GRIHO listings.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Standard Advance Deposit</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Under standard Dhaka & Chittagong rental customs, 2 months advance security deposit is standard. Always obtain a written receipt.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-xs sm:text-sm">0% Brokerage Guarantee</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  GRIHO never charges middleman or broker fees. You connect directly with verified house owners via phone and WhatsApp.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MY LISTINGS (FOR LANDLORDS) */}
        {/* ========================================================= */}
        {activeTab === 'listings' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">Your Listed Properties ({myListings.length})</h2>
                <p className="text-xs text-slate-400">Manage availability, edit pricing, and review prospective tenants</p>
              </div>
              <button
                onClick={() => {
                  if (onOpenPostModal) onOpenPostModal();
                }}
                className="btn-primary px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post New Flat</span>
              </button>
            </div>

            {myListings.length === 0 ? (
              <div className="glass-panel p-10 rounded-2xl text-center space-y-3">
                <Building className="w-12 h-12 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base">No Properties Listed Yet</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    List your flat, bachelor sublet, or room in Dhaka & Chittagong to reach thousands of verified tenants with zero broker commission.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (onOpenPostModal) onOpenPostModal();
                  }}
                  className="btn-primary py-2 px-5 rounded-xl font-bold text-xs inline-block cursor-pointer shadow-md"
                >
                  List Your First Flat Free
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {myListings.map((p) => (
                  <div key={p._id} className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3 shadow-md flex flex-col justify-between">
                    <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-800">
                      <PropertyVisual property={p} aspect="aspect-[16/10]" showBadges={false} className="h-full p-2" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-black text-base">৳{formatBDT(p.rent)}<span className="text-[10px] text-slate-400 font-normal">/mo</span></span>
                        <button
                          onClick={() => handleTogglePropertyStatus(p._id, p.status)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                            p.status === 'Available'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {p.status} (Toggle)
                        </button>
                      </div>
                      <h4 className="font-bold text-white text-xs line-clamp-1">{p.title}</h4>
                      <div className="text-[11px] text-slate-400">{p.address || `${p.area}, ${p.city}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TOUR INQUIRIES */}
        {/* ========================================================= */}
        {activeTab === 'inquiries' && (
          <div className="glass-panel p-5 sm:p-7 rounded-2xl border border-slate-800 space-y-5 animate-fade-in shadow-xl">
            <div className="pb-3 border-b border-slate-800">
              <h2 className="text-lg sm:text-xl font-black text-white">Physical Tour Visits & Inquiries ({myInquiries.length})</h2>
              <p className="text-xs text-slate-400">Manage scheduled physical in-person apartment visits and direct inquiries</p>
            </div>
            
            {myInquiries.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="font-bold text-white text-base">No Tour Inquiries Scheduled</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  When you schedule property visits or tenants request tours of your listings, they will appear right here with full details.
                </p>
                <Link to="/" className="btn-primary py-2 px-5 rounded-xl font-bold text-xs inline-block cursor-pointer mt-1">
                  Browse Verified Flats
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {myInquiries.map((inq) => (
                  <div key={inq._id} className="p-4 rounded-xl bg-slate-950/85 border border-slate-800 space-y-3 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white text-sm sm:text-base">{inq.propertyTitle}</div>
                        <div className="text-xs text-slate-300">
                          Applicant: <strong className="text-white">{inq.name}</strong> ({inq.tenantType}) • Phone: <strong className="text-white">{inq.phone}</strong>
                        </div>
                        {inq.preferredVisitDate && (
                          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Preferred Date: {inq.preferredVisitDate} {inq.preferredVisitTime ? `at ${inq.preferredVisitTime}` : ''}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-xs font-bold rounded-xl px-2.5 py-1.5 text-slate-200 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1.5 font-bold text-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                    {inq.message && (
                      <p className="text-xs text-slate-300 italic bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        "{inq.message}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SAVED HOMES */}
        {/* ========================================================= */}
        {activeTab === 'saved' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">Your Saved Rental Homes ({savedFlats.length})</h2>
              <p className="text-xs text-slate-400">Bookmarked apartments and sublets for easy reference</p>
            </div>

            {savedFlats.length === 0 ? (
              <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
                <Heart className="w-12 h-12 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base">No Saved Homes Yet</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Click the heart icon on any flat card across GRIHO to bookmark and compare your favorite properties.
                  </p>
                </div>
                <Link to="/" className="btn-primary py-2 px-5 rounded-xl font-bold text-xs inline-block cursor-pointer shadow-md">
                  Browse Verified Flats
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {savedFlats.map((p) => (
                  <div key={p._id} className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3 shadow-md flex flex-col justify-between">
                    <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-800">
                      <PropertyVisual property={p} aspect="aspect-[16/10]" showBadges={false} className="h-full p-2" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-emerald-400 font-black text-base">৳{formatBDT(p.rent)}<span className="text-[10px] text-slate-400 font-normal">/mo</span></div>
                      <h4 className="font-bold text-white text-xs line-clamp-1">{p.title}</h4>
                      <div className="text-[11px] text-slate-400">{p.area}, {p.city}</div>
                      <Link
                        to="/"
                        className="btn-secondary w-full py-1.5 rounded-xl text-xs font-bold text-center block mt-2"
                      >
                        View Details on Home
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: PROFILE & NID VERIFICATION */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="glass-panel p-5 sm:p-8 rounded-2xl border border-slate-800 max-w-2xl mx-auto space-y-6 animate-fade-in shadow-xl">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">Your Profile & NID Verification</h2>
              <p className="text-xs text-slate-400">Update your personal contact details and National ID for verified citizen badges</p>
            </div>

            {profileMessage && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                profileMessage.type === 'success'
                  ? 'bg-emerald-950/90 border border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/90 border border-rose-500/50 text-rose-300'
              }`}>
                {profileMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-slate-200 text-xs">Full Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full glass-input rounded-xl p-3 text-xs sm:text-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-200 text-xs">Phone Number (Bangladesh) *</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full glass-input rounded-xl p-3 text-xs sm:text-sm"
                    placeholder="e.g. 01712345678"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 text-xs">National ID (NID) Number</label>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    🛡️ Unlocks Verified Badge
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="10 digit smart card or 17 digit Bangladesh NID"
                  value={editForm.nidNumber}
                  onChange={(e) => setEditForm({ ...editForm, nidNumber: e.target.value })}
                  className="w-full glass-input rounded-xl p-3 text-xs sm:text-sm"
                />
                <p className="text-[11px] text-slate-400">
                  Your NID is encrypted and securely stored for platform safety and direct trust verification.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200 text-xs">Account Type / Platform Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full glass-input rounded-xl p-3 text-xs sm:text-sm bg-slate-900 cursor-pointer"
                >
                  <option value="tenant">Tenant (ভাড়াটিয়া) - Searching for flat, sublet, or room</option>
                  <option value="landlord">Landlord (বাড়িওয়ালা) - Property owner or manager</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="btn-primary w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <span>{profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>

            </form>
          </div>
        )}

      </main>

      {/* Footer minimal signature */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="w-full max-w-7xl mx-auto px-4">
          GRIHO (গৃহ) Bangladesh • 100% Free Verified House Rental Platform
        </div>
      </footer>

    </div>
  );
}
