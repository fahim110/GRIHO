import React, { useState } from 'react';
import { X, User, Phone, Mail, ShieldCheck, Building, LogOut, CheckCircle2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserProfileModal({ isOpen, onClose, onOpenSaved, lang = 'en' }) {
  if (!isOpen) return null;

  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    nidNumber: user?.nidNumber || '',
    role: user?.role || 'tenant',
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setSaving(false);
      setIsEditing(false);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      alert(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-slate-950/95">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-black text-white">
              {lang === 'bn' ? 'ব্যবহারকারীর প্রোফাইল' : 'User Profile'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-10 space-y-6 text-sm">
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* User Avatar & Role Badge */}
          <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-950/80 border border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-white truncate">{user.name}</h3>
              <div className="text-slate-400 text-sm truncate mt-0.5">{user.email}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-200 uppercase tracking-wider">
                  {user.role === 'landlord' ? '🏢 Landlord' : '🏠 Tenant'}
                </span>
                {user.nidVerified && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>NID Verified</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="font-bold text-slate-200 block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full glass-input rounded-2xl p-3.5 text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full glass-input rounded-2xl p-3.5 text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1.5">Account Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full glass-input rounded-2xl p-3.5 text-sm bg-slate-900 cursor-pointer"
                >
                  <option value="tenant">Tenant (Looking for rental flats)</option>
                  <option value="landlord">Landlord (Listing properties)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1.5">National ID (NID) Number</label>
                <input
                  type="text"
                  placeholder="10 or 17 digit NID"
                  value={formData.nidNumber}
                  onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
                  className="w-full glass-input rounded-2xl p-3.5 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary flex-1 py-3 rounded-2xl text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 py-3 rounded-2xl text-sm font-bold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3 bg-slate-950/60 p-5 rounded-3xl border border-slate-800 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-semibold text-white">{user.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NID Status:</span>
                  <span className="font-semibold text-emerald-400">
                    {user.nidNumber ? `Verified (${user.nidNumber})` : 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Saved Properties:</span>
                  <span className="font-semibold text-rose-400">
                    {user.savedProperties?.length || 0} Flats
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex-1 py-3 rounded-2xl text-sm font-semibold cursor-pointer"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenSaved();
                  }}
                  className="btn-secondary px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 text-rose-300 cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Saved</span>
                </button>
              </div>

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-900/40 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out from GRIHO</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
