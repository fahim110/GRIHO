import React, { useState, useEffect } from 'react';
import { Users, Plus, MapPin, Banknote, MessageCircle, Phone, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { fetchRoommates, createRoommatePost } from '../api';

export default function RoommatesSection({ lang = 'en', onSelectArea }) {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState('All');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

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
      const res = await fetchRoommates({ gender: genderFilter === 'All' ? '' : genderFilter });
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
      setIsPostModalOpen(false);
      loadRoommates();
    } catch (e) {
      alert(e.message);
    }
  };

  const formatBDT = (amount) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            <Users className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ব্যাচেলর ও স্টুডেন্ট সাবলেট হাব' : 'Student & Bachelor Flatmate Matching'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === 'bn' ? 'রুমমেট ও সাবলেট রুম খুঁজুন' : 'Find Flatmates & Sublet Rooms'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {lang === 'bn'
              ? 'বসুন্ধরা (NSU/IUB), ধানমন্ডি ও মিরপুর এলাকায় বিশ্বস্ত ছাত্র বা চাকুরিজীবী রুমমেট খুঁজুন সহজে।'
              : 'Connect with verified university students and professionals looking for roommates in prime areas.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Gender Filter Chips */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            {['All', 'Male', 'Female'].map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  genderFilter === g ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {g === 'All' ? 'All' : g === 'Male' ? 'Boys' : 'Girls'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="btn-primary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? 'রুমমেট খুঁজুন' : '+ Post Roommate Ad'}</span>
          </button>
        </div>
      </div>

      {/* Roommates Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading flatmate postings...</div>
      ) : roommates.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
          No roommate requests found for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roommates.map((r) => (
            <div
              key={r._id}
              className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.posterGender === 'Female'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                        : 'bg-sky-950/80 text-sky-300 border border-sky-500/30'
                    }`}
                  >
                    {r.posterGender === 'Female' ? '👩 Female Flatmate' : '👨 Male Flatmate'}
                  </span>
                  <span className="text-emerald-400 font-extrabold text-sm">
                    ৳{formatBDT(r.budgetBDT)}/mo
                  </span>
                </div>

                <h3 className="font-bold text-white text-xs line-clamp-2 mb-2">{r.title}</h3>

                <div className="space-y-1 text-[11px] text-slate-300 mb-3">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{r.area}, {r.city}</span>
                  </div>
                  <div className="font-medium text-slate-200">
                    🎓 {r.userType} ({r.institutionOrCompany})
                  </div>
                  <div className="text-slate-400">
                    🛏️ {r.roomType} • Available: {r.availableFrom}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-4 italic bg-slate-950/60 p-2 rounded-xl">
                  "{r.description}"
                </p>
              </div>

              {/* Contact Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <a
                  href={`https://wa.me/${(r.contactWhatsApp || r.contactPhone).replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${r.contactPhone}`}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  title="Call"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Post Flatmate / Sublet Request</span>
              </h3>
              <button onClick={() => setIsPostModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Ad Title *</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Roommate Needed for Master Bed in Bashundhara Block-D"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full glass-input rounded-xl p-2.5 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.posterName}
                    onChange={(e) => setFormData({ ...formData, posterName: e.target.value })}
                    className="w-full glass-input rounded-xl p-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Gender</label>
                  <select
                    value={formData.posterGender}
                    onChange={(e) => setFormData({ ...formData, posterGender: e.target.value })}
                    className="w-full glass-input rounded-xl p-2 text-xs bg-slate-900"
                  >
                    <option value="Male">Male (ছেলে)</option>
                    <option value="Female">Female (মেয়ে)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Area / Neighborhood</label>
                  <input
                    type="text"
                    placeholder="e.g. Bashundhara, Dhanmondi"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full glass-input rounded-xl p-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Monthly Budget (৳)</label>
                  <input
                    type="number"
                    value={formData.budgetBDT}
                    onChange={(e) => setFormData({ ...formData, budgetBDT: e.target.value })}
                    className="w-full glass-input rounded-xl p-2 text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">University / Company</label>
                  <input
                    type="text"
                    placeholder="e.g. NSU CSE / Job Holder"
                    value={formData.institutionOrCompany}
                    onChange={(e) => setFormData({ ...formData, institutionOrCompany: e.target.value })}
                    className="w-full glass-input rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Phone / WhatsApp</label>
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
                    className="w-full glass-input rounded-xl p-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Description & Flat Details *</label>
                <textarea
                  rows={3}
                  placeholder="Describe your flat, facilities (WiFi, Maid, Geyser, Gas) and flatmate preference..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full glass-input rounded-xl p-2 text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-2.5 rounded-xl font-bold text-xs mt-2"
              >
                Publish Flatmate Ad Free
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
