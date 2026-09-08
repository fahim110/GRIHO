import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  Building,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OtpVerificationModal from '../components/OtpVerificationModal';
import GenuineSocialAuthModal from '../components/GenuineSocialAuthModal';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'tenant',
    nidNumber: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // OTP Verification Window State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingEmailSent, setPendingEmailSent] = useState(true);

  // Listen for OAuth Popup PostMessage
  useEffect(() => {
    const handleOAuthMessage = (event) => {
      if (event.data?.type === 'GRIHO_OAUTH_SUCCESS') {
        navigate('/dashboard');
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await register(formData);
      setLoading(false);
      if (res?.requireOtp) {
        setPendingEmail(res.email || formData.email);
        setPendingEmailSent(res.emailSent !== false);
        setShowOtpModal(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please check your information.');
    }
  };

  const [socialModal, setSocialModal] = useState({ isOpen: false, provider: 'google' });

  const handleSocialAuth = (provider) => {
    setSocialModal({ isOpen: true, provider });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-3 sm:p-5 lg:p-6 relative overflow-hidden bg-slate-950 font-sans">
      
      {/* Ambient Dynamic Theme Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-500" style={{ background: 'var(--bg-radial-1, rgba(16, 185, 129, 0.16))' }} />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-500" style={{ background: 'var(--bg-radial-2, rgba(14, 165, 233, 0.14))' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[180px] pointer-events-none transition-all duration-500" style={{ background: 'var(--bg-radial-3, rgba(99, 102, 241, 0.08))' }} />

      {/* Main Split Authentication Card (~75% scaling) */}
      <div className="w-full max-w-4xl xl:max-w-5xl relative z-10 bg-slate-900/95 border border-slate-800/90 rounded-[28px] sm:rounded-[36px] shadow-2xl p-4 sm:p-6 lg:p-7 backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: REGISTRATION FORM */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-1 sm:p-3 lg:p-4 space-y-4 sm:space-y-5">
          
          {/* Header & Logo */}
          <div>
            <div className="flex items-center justify-between">
              <Link to="/" className="inline-flex items-center gap-2.5 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-all duration-300 border border-emerald-400/30">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white">GRIHO</span>
                  <span className="font-bengali text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/40">গৃহ</span>
                </div>
              </Link>
              <Link to="/" className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium">
                ← Back to Home
              </Link>
            </div>

            <div className="mt-5 sm:mt-6">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Create account
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Join verified tenants and property owners across Bangladesh
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Account Role Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-300 uppercase tracking-wider text-[11px]">Registering As:</span>
              <span className="text-slate-400 text-[11px]">Select account type</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'tenant' })}
                className={`py-2.5 px-3 min-h-[50px] sm:min-h-[52px] rounded-xl flex items-center justify-center gap-2.5 font-bold transition-all cursor-pointer ${
                  formData.role === 'tenant'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30 border border-emerald-400/40 scale-[1.01]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/15 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs sm:text-sm font-black block leading-tight">Tenant</span>
                  <span className="text-[10px] sm:text-[11px] font-bengali opacity-80 block">ভাড়াটিয়া</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'landlord' })}
                className={`py-2.5 px-3 min-h-[50px] sm:min-h-[52px] rounded-xl flex items-center justify-center gap-2.5 font-bold transition-all cursor-pointer ${
                  formData.role === 'landlord'
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/30 border border-sky-400/40 scale-[1.01]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/15 shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs sm:text-sm font-black block leading-tight">Landlord</span>
                  <span className="text-[10px] sm:text-[11px] font-bengali opacity-80 block">বাড়িওয়ালা</span>
                </div>
              </button>
            </div>
          </div>

          {/* Registration Form (~75% scaled inputs) */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
            
            {/* Name and Phone in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 text-xs">Full Name *</label>
                <div className="input-box-wrapper rounded-xl px-3.5 py-2.5 min-h-[46px] sm:min-h-[48px] flex items-center gap-2.5">
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

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 text-xs">Phone Number *</label>
                <div className="input-box-wrapper rounded-xl px-3.5 py-2.5 min-h-[46px] sm:min-h-[48px] flex items-center gap-2.5">
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
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 text-xs">Email Address *</label>
              <div className="input-box-wrapper rounded-xl px-3.5 py-2.5 min-h-[46px] sm:min-h-[48px] flex items-center gap-2.5">
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

            {/* Password */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 text-xs">Password * (min 6 characters)</label>
              <div className="input-box-wrapper rounded-xl px-3.5 py-2.5 min-h-[46px] sm:min-h-[48px] flex items-center gap-2.5">
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
                  className="text-slate-400 hover:text-slate-200 cursor-pointer p-1 shrink-0 transition-colors rounded-lg hover:bg-slate-800/60"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Optional National ID */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-200 text-xs">National ID (NID)</label>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Citizen Badge</span>
                </span>
              </div>
              <div className="input-box-wrapper rounded-xl px-3.5 py-2.5 min-h-[46px] sm:min-h-[48px] flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Optional 10 or 17 digit NID number"
                  value={formData.nidNumber}
                  onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
                  className="w-full bg-transparent border-0 outline-0 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-0 p-0"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 min-h-[48px] sm:min-h-[50px] rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/30 mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration & Open Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Google Register Option */}
          <div className="pt-3 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Or register with</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            <button
              type="button"
              onClick={() => handleSocialAuth('google')}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border border-slate-200"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Register with Google</span>
            </button>
          </div>

          {/* Switch to Login */}
          <div className="pt-1 text-center">
            <p className="text-xs sm:text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 font-extrabold hover:text-emerald-300 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: RENTAL HOUSE ILLUSTRATION */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 xl:col-span-5 relative rounded-[22px] sm:rounded-[28px] overflow-hidden min-h-[300px] lg:min-h-[460px] shadow-2xl border border-slate-800/80 group">
          
          {/* Architectural Rental House Artwork */}
          <img
            src="/auth_rental_art.jpg"
            alt="GRIHO Modern Rental Houses & Apartments"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />

          {/* Top Badge */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="bg-slate-950/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-bold text-white shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>GRIHO Community</span>
            </div>
            <div className="bg-emerald-950/85 backdrop-blur-md border border-emerald-500/40 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-300 font-bengali">
              নিবন্ধন
            </div>
          </div>

          {/* Bottom Card Content (~75% scaled sizes) */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                Direct Rental Ecosystem
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white leading-snug">
              Rent Smart. Live Better.
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 font-bengali leading-relaxed">
              সরাসরি যোগাযোগ ও স্বচ্ছ ভাড়ার নিশ্চয়তা নিয়ে GRIHO তে আজই যোগ দিন।
            </p>

            <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-200">
              <span className="bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">✓ Verified Profiles</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">✓ 100% Free For Tenants</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">✓ Fast Inquiries</span>
            </div>
          </div>

        </div>

      </div>

      {/* Email OTP Verification Window */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        email={pendingEmail}
        emailSent={pendingEmailSent}
        onClose={() => setShowOtpModal(false)}
        onSuccess={() => {
          setShowOtpModal(false);
          navigate('/dashboard');
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
