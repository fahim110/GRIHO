import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles, Building, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess, lang = 'en' }) {
  if (!isOpen) return null;

  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'tenant', // 'tenant' | 'landlord'
    nidNumber: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      setLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please check your details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
              G
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {mode === 'login' ? (lang === 'bn' ? 'GRIHO তে লগইন করুন' : 'Welcome to GRIHO') : (lang === 'bn' ? 'নতুন একাউন্ট খুলুন' : 'Create Your Account')}
              </h2>
              <p className="text-[10px] text-slate-400">
                {mode === 'login' ? 'Access your saved homes & inquiries' : 'Join verified tenants & landlords in BD'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 border-b border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'login' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'bn' ? 'লগইন (Sign In)' : 'Sign In'}
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'register' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'bn' ? 'রেজিস্টার (Sign Up)' : 'Sign Up'}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Registration Role Selection */}
          {mode === 'register' && (
            <div>
              <label className="font-semibold text-slate-300 block mb-1.5">
                {lang === 'bn' ? 'আপনার একাউন্টের ধরন নির্বাচন করুন:' : 'I am registering as:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'tenant' })}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    formData.role === 'tenant'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">Tenant (ভাড়াটিয়া)</div>
                    <div className="text-[10px] text-slate-400">Looking for flat/room</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'landlord' })}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    formData.role === 'landlord'
                      ? 'bg-sky-950/80 border-sky-500 text-sky-300 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">Landlord (বাড়িওয়ালা)</div>
                    <div className="text-[10px] text-slate-400">Listing properties</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Full Name for Register */}
          {mode === 'register' && (
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                {lang === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Fahim Ahmed"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              {lang === 'bn' ? 'ইমেইল অ্যাড্রেস *' : 'Email Address *'}
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs"
                required
              />
            </div>
          </div>

          {/* Phone Number for Register */}
          {mode === 'register' && (
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                {lang === 'bn' ? 'মোবাইল নম্বর (BD Phone) *' : 'Phone Number (BD) *'}
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs"
                  required
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              {lang === 'bn' ? 'পাসওয়ার্ড *' : 'Password *'}
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* NID Number (Optional for Verification Badge) */}
          {mode === 'register' && (
            <div>
              <label className="font-semibold text-slate-300 block mb-1 flex items-center justify-between">
                <span>{lang === 'bn' ? 'জাতীয় পরিচয়পত্র (NID) নম্বর' : 'National ID (NID) Number'}</span>
                <span className="text-[10px] text-emerald-400 font-bold">✨ Gets Verified Badge</span>
              </label>
              <div className="relative">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Optional (10 or 17 digit NID)"
                  value={formData.nidNumber}
                  onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
                  className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/25 mt-2"
          >
            <span>{loading ? 'Please wait...' : mode === 'login' ? (lang === 'bn' ? 'লগইন করুন' : 'Sign In to Account') : (lang === 'bn' ? 'রেজিস্ট্রেশন সম্পন্ন করুন' : 'Create Account')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Demo Credentials Helper */}
          {mode === 'login' && (
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-center">
              💡 Don't have an account? Switch to <button type="button" onClick={() => setMode('register')} className="text-emerald-400 font-bold hover:underline">Sign Up</button> in 10 seconds.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
