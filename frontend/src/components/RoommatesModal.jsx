import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  X,
  Sparkles,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { fetchRoommates, createRoommatePost } from '../api';

export default function RoommatesModal({
  isOpen,
  onClose,
  lang = 'en',
  onSelectArea,
}) {
  if (!isOpen) return null;

  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // New post form state
  const [formData, setFormData] = useState({
    title: '',
    posterName: '',
    posterGender: 'Male',
    userType: 'University Student',
    institutionOrCompany: '',
    area: 'Bashundhara R/A',
    budgetBDT: 8000,
    roomType: 'Single Attached Bath',
    availableFrom: 'Immediate',
    contactPhone: '',
    contactWhatsApp: '',
    description: '',
  });

  const loadRoommates = async () => {
    setLoading(true);
    try {
      const res = await fetchRoommates({
        gender: genderFilter === 'All' ? '' : genderFilter,
      });
      if (res.success) setRoommates(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoommates();
  }, [genderFilter]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await createRoommatePost({
        ...formData,
        budgetBDT: Number(formData.budgetBDT),
      });
      setPostSuccess(true);
      setTimeout(() => {
        setPostSuccess(false);
        setIsPostModalOpen(false);
        loadRoommates();
      }, 1200);
    } catch (e) {
      alert(e.message || 'Failed to post roommate ad');
    }
  };

  const formatBDT = (amount) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount || 0);

  const filteredRoommates = roommates.filter((r) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.title?.toLowerCase().includes(query) ||
      r.area?.toLowerCase().includes(query) ||
      r.city?.toLowerCase().includes(query) ||
      r.institutionOrCompany?.toLowerCase().includes(query) ||
      r.userType?.toLowerCase().includes(query)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in font-sans"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-[32px] shadow-2xl overflow-hidden flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 25px 70px -15px rgba(0,0,0,0.85)' }}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-800 bg-slate-950/60 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1.5">
              <Users className="w-4 h-4" />
              <span>
                {lang === 'bn'
                  ? 'ব্যাচেলর ও স্টুডেন্ট রুমমেট ফাইন্ডার'
                  : 'Bachelor & Student Roommate Finder'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {lang === 'bn' ? 'রুমমেট ও সাবলেট রুম খুঁজুন' : 'Find Flatmates & Sublet Rooms'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {lang === 'bn'
                ? 'বসুন্ধরা (NSU/IUB), ধানমন্ডি, মিরপুর ও গুলশানে বিশ্বস্ত ছাত্র বা চাকুরিজীবী রুমমেট খুঁজুন।'
                : 'Connect with verified students and working professionals for shared flats & sublets.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="btn-primary px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'bn' ? 'বিজ্ঞাপন দিন' : '+ Post Flatmate Ad'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-4 sm:px-8 border-b border-slate-800/80 bg-slate-900/90 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search area (e.g. Bashundhara, Dhanmondi, NSU, AIUB)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Gender Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            {['All', 'Male', 'Female'].map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  genderFilter === g
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g === 'All' ? 'All (সবাই)' : g === 'Male' ? 'Boys (ছেলে)' : 'Girls (মেয়ে)'}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body: Roommates Grid */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="text-center py-20 text-slate-400 text-sm">
              Loading verified roommate postings...
            </div>
          ) : filteredRoommates.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-950/50 border border-slate-800 text-center text-slate-400 text-sm space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p>No roommate requests found matching your filter.</p>
              <button
                onClick={() => {
                  setGenderFilter('All');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-sky-400 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredRoommates.map((r) => (
                <div
                  key={r._id}
                  className="bg-slate-950/70 p-5 sm:p-6 rounded-3xl border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between space-y-4 shadow-md hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          r.posterGender === 'Female'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                            : 'bg-sky-950/80 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {r.posterGender === 'Female' ? '👩 Female Flatmate' : '👨 Male Flatmate'}
                      </span>
                      <span className="text-emerald-400 font-black text-base sm:text-lg">
                        ৳{formatBDT(r.budgetBDT)}
                        <span className="text-xs text-slate-400 font-normal">/mo</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm sm:text-base line-clamp-2 mb-2">
                      {r.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-300 mb-3.5">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>
                          {r.area}, {r.city}
                        </span>
                      </div>
                      {r.institutionOrCompany && (
                        <div className="font-semibold text-slate-200">
                          🎓 {r.userType} ({r.institutionOrCompany})
                        </div>
                      )}
                      <div className="text-slate-400">
                        🛏️ {r.roomType || 'Shared Room'} • Available: {r.availableFrom || 'Immediate'}
                      </div>
                    </div>

                    {r.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3 italic bg-slate-900/90 p-3 rounded-2xl border border-slate-800/80">
                        "{r.description}"
                      </p>
                    )}
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex items-center gap-2.5 pt-3 border-t border-slate-800/80">
                    <a
                      href={`https://wa.me/${(r.contactWhatsApp || r.contactPhone).replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    {r.contactPhone && (
                      <a
                        href={`tel:${r.contactPhone}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Direct Phone Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Roommate Ad Inner Modal */}
        {isPostModalOpen && (
          <div className="fixed inset-0 z-60 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div
              className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  <span>Post Flatmate / Sublet Request</span>
                </h3>
                <button
                  onClick={() => setIsPostModalOpen(false)}
                  className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {postSuccess ? (
                <div className="py-12 text-center space-y-3 animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Ad Published Successfully!</h4>
                  <p className="text-xs text-slate-400">Refreshing roommate listings...</p>
                </div>
              ) : (
                <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Ad Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Roommate Needed for Master Bed in Bashundhara Block-D"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">Your Name *</label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.posterName}
                        onChange={(e) => setFormData({ ...formData, posterName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">Gender</label>
                      <select
                        value={formData.posterGender}
                        onChange={(e) => setFormData({ ...formData, posterGender: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                      >
                        <option value="Male">Male (ছেলে)</option>
                        <option value="Female">Female (মেয়ে)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">Area / Location *</label>
                      <input
                        type="text"
                        placeholder="e.g. Bashundhara, Dhanmondi"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">Monthly Budget (৳) *</label>
                      <input
                        type="number"
                        value={formData.budgetBDT}
                        onChange={(e) => setFormData({ ...formData, budgetBDT: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">University / Company</label>
                      <input
                        type="text"
                        placeholder="e.g. NSU CSE / IT Professional"
                        value={formData.institutionOrCompany}
                        onChange={(e) => setFormData({ ...formData, institutionOrCompany: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-200 block mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        placeholder="017XXXXXXXX"
                        value={formData.contactPhone}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            contactPhone: e.target.value,
                            contactWhatsApp: e.target.value,
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Details & Facilities *</label>
                    <textarea
                      rows={3}
                      placeholder="Describe flat facilities (WiFi, Gas, Attached Bath, Maid) and roommate preferences..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-3 rounded-xl font-bold text-sm mt-2 cursor-pointer shadow-xl shadow-emerald-500/30"
                  >
                    Publish Flatmate Ad Free
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
