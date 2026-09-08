import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Mail, User, Phone, ShieldCheck, Building, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OtpVerificationModal from './OtpVerificationModal';
import GenuineSocialAuthModal from './GenuineSocialAuthModal';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess, lang = 'en' }) {
  if (!isOpen) return null;

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // OTP Window State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingEmailSent, setPendingEmailSent] = useState(true);
  const [socialModal, setSocialModal] = useState({ isOpen: false, provider: 'google' });

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
        setLoading(false);
        onClose();
        if (onSuccess) onSuccess();
      } else {
        const res = await register(formData);
        setLoading(false);
        if (res?.requireOtp) {
          setPendingEmail(res.email || formData.email);
          setPendingEmailSent(res.emailSent !== false);
          setShowOtpModal(true);
        } else {
          onClose();
          if (onSuccess) onSuccess();
        }
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please check your details.');
    }
  };

  const handleSocialAuth = (provider) => {
    setSocialModal({ isOpen: true, provider });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in font-sans">
      <div
        className="relative w-full max-w-md sm:max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (~75% scaled down) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/95">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-base shadow-md shadow-emerald-500/30">
              G
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {mode === 'login' ? (lang === 'bn' ? 'GRIHO তে সাইন ইন করুন' : 'Welcome to GRIHO') : (lang === 'bn' ? 'নতুন একাউন্ট খুলুন' : 'Create Your Account')}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {mode === 'login' ? 'Access your saved homes & inquiries' : 'Join verified tenants & landlords in Bangladesh'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 border-b border-slate-800 text-xs sm:text-sm font-bold gap-1.5">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'login' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'bn' ? 'লগইন (Sign In)' : 'Sign In'}
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'register' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'bn' ? 'রেজিস্টার (Sign Up)' : 'Sign Up'}
          </button>
        </div>

        {/* Form Body (~75% scaled sizes) */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Registration Role Selection */}
          {mode === 'register' && (
            <div>
              <label className="font-bold text-slate-300 block mb-1.5 text-[11px] uppercase tracking-wider">
                {lang === 'bn' ? 'আপনার একাউন্টের ধরন:' : 'Registering as:'}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'tenant' })}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    formData.role === 'tenant'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-white">Tenant (ভাড়াটিয়া)</div>
                    <div className="text-[10px] text-slate-400">Looking for rental</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'landlord' })}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    formData.role === 'landlord'
                      ? 'bg-sky-950/80 border-sky-500 text-sky-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-white">Landlord (বাড়িওয়ালা)</div>
                    <div className="text-[10px] text-slate-400">Listing properties</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Full Name for Register */}
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-200 block text-xs">
                {lang === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
              </label>
              <div className="input-box-wrapper rounded-xl px-3.5 py-2.5 min-h-[46px] flex items-center gap-2.5">
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-0 outline-0 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-0 p-0"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1">
            <label className="font-bold text-slate-200 block text-xs">
              {lang === 'bn' ? 'ইমেইল অ্যাড্রেস *' : 'Email Address *'}
            </label>
            <div className="input-box-wrapper rounded-xl px-3.5 py-2.5 min-h-[46px] flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border-0 outline-0 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-0 p-0"
                required
              />
            </div>
          </div>

          {/* Phone Number for Register */}
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-200 block text-xs">
                {lang === 'bn' ? 'মোবাইল নম্বর (BD Phone) *' : 'Phone Number (BD) *'}
              </label>
              <div className="input-box-wrapper rounded-xl px-3.5 py-2.5 min-h-[46px] flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-0 outline-0 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-0 p-0"
                  required
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1">
            <label className="font-bold text-slate-200 block text-xs">
              {lang === 'bn' ? 'পাসওয়ার্ড *' : 'Password *'}
            </label>
            <div className="input-box-wrapper rounded-xl px-3.5 py-2.5 min-h-[46px] flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-transparent border-0 outline-0 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-0 p-0"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer p-1 shrink-0 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* NID Number (Optional for Verification Badge) */}
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-200 block flex items-center justify-between text-xs">
                <span>{lang === 'bn' ? 'জাতীয় পরিচয়পত্র (NID) নম্বর' : 'National ID (NID) Number'}</span>
                <span className="text-[11px] text-emerald-400 font-bold">✨ Verified Badge</span>
              </label>
              <div className="input-box-wrapper rounded-xl px-3.5 py-2.5 min-h-[46px] flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Optional (10 or 17 digit NID)"
                  value={formData.nidNumber}
                  onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
                  className="w-full bg-transparent border-0 outline-0 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-0 p-0"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 min-h-[46px] rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/30 mt-2"
          >
            <span>{loading ? 'Please wait...' : mode === 'login' ? (lang === 'bn' ? 'লগইন করুন' : 'Sign In to Account') : (lang === 'bn' ? 'রেজিস্ট্রেশন সম্পন্ন করুন' : 'Create Account')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Google Connect Button in Modal */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Or continue with</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            <button
              type="button"
              onClick={() => handleSocialAuth('google')}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-200"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </form>
      </div>

      {/* OTP Modal if registering through AuthModal */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        email={pendingEmail}
        emailSent={pendingEmailSent}
        onClose={() => setShowOtpModal(false)}
        onSuccess={() => {
          setShowOtpModal(false);
          onClose();
          if (onSuccess) onSuccess();
        }}
      />

      {/* Genuine Social Auth Modal */}
      <GenuineSocialAuthModal
        isOpen={socialModal.isOpen}
        provider={socialModal.provider}
        role={formData.role}
        onClose={() => setSocialModal({ isOpen: false, provider: 'google' })}
      />
    </div>
  );
}
