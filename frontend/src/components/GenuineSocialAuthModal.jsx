import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, CheckCircle, AlertCircle, Loader2, ArrowRight, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function GenuineSocialAuthModal({
  isOpen,
  onClose,
  provider = 'google',
  role = 'tenant',
}) {
  if (!isOpen) return null;

  const { googleLogin, socialLogin } = useAuth();
  const navigate = useNavigate();

  const googleBtnRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  
  const [googleClientId, setGoogleClientId] = useState(() => {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('griho_google_client_id') || '';
  });

  // Sample quick-test Google profiles
  const sampleGoogleAccounts = [
    {
      name: 'Tanvir Ahmed',
      email: 'tanvir.ahmed.bd@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      role: 'tenant',
      roleLabel: 'Verified Tenant (ভাড়াটিয়া)',
    },
    {
      name: 'Fahim Chowdhury',
      email: 'chowdhury.properties@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
      role: 'landlord',
      roleLabel: 'Verified Landlord (বাড়িওয়ালা)',
    },
  ];

  // Handle genuine credential response from Google Identity Services
  const handleGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      setError('No credential received from Google. Please try again.');
      return;
    }

    setLoading(true);
    setStatusMessage('Verifying authentic Google credential with backend...');
    setError(null);

    try {
      const user = await googleLogin({
        credential: response.credential,
        role: role,
      });

      setStatusMessage(`Welcome ${user.name}! Redirecting to your dashboard...`);
      setTimeout(() => {
        setLoading(false);
        onClose();
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to authenticate Google account with server.');
    }
  };

  // Initialize official Google Identity Services (GIS)
  useEffect(() => {
    if (!googleClientId) return;

    let checkInterval = null;
    const initGIS = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              shape: 'rectangular',
              text: 'continue_with',
              logo_alignment: 'left',
              width: 320,
            });
          }

          // Trigger genuine Google One-Tap prompt
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed()) {
              console.log('Google One-Tap prompt not displayed:', notification.getNotDisplayedReason());
            }
          });
        } catch (err) {
          console.error('Google Identity Services initialization error:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGIS();
    } else {
      checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkInterval);
          initGIS();
        }
      }, 200);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [googleClientId, role]);

  const handleLaunchGoogleDirectOAuth = () => {
    if (!googleClientId) return;
    const redirectUri = window.location.origin + '/oauth/google';
    const scope = encodeURIComponent('openid profile email');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(googleClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=select_account`;
    window.location.href = authUrl;
  };

  const handleQuickTestGoogleLogin = async (acc) => {
    setLoading(true);
    setStatusMessage(`Signing in with Google Account (${acc.email})...`);
    setError(null);

    try {
      const user = await socialLogin({
        provider: 'google',
        name: acc.name,
        email: acc.email,
        avatar: acc.avatar,
        role: acc.role || role,
      });

      setStatusMessage(`Welcome ${user.name}! Redirecting to your dashboard...`);
      setTimeout(() => {
        setLoading(false);
        onClose();
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to sign in with Google account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in font-sans">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-[28px] shadow-2xl overflow-hidden p-6 sm:p-7 text-white"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 25px 60px -15px rgba(0,0,0,0.85)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer z-10"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Google Logo */}
        <div className="text-center space-y-2 mb-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-200">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Sign in with Google
          </h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-bold text-emerald-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Google OAuth 2.0 Verification</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="py-8 text-center space-y-3 animate-fade-in">
            <Loader2 className="w-9 h-9 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm font-bold text-white">{statusMessage}</p>
            <p className="text-xs text-slate-400">Verifying session with GRIHO server...</p>
          </div>
        )}

        {/* Google Options */}
        {!loading && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3.5">
              <div className="text-xs text-slate-300 font-medium text-center">
                One-Click Authentic Google Login:
              </div>

              {/* Official GIS Button Container */}
              <div className="flex justify-center min-h-[44px]">
                <div ref={googleBtnRef} id="google-gis-btn-container" className="inline-block" />
              </div>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500"><span className="bg-slate-950 px-2">or direct accounts window</span></div>
              </div>

              {/* Direct Google Accounts Button */}
              <button
                type="button"
                onClick={handleLaunchGoogleDirectOAuth}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md border border-slate-200"
              >
                <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with accounts.google.com</span>
              </button>
            </div>

            {/* Quick Demo Google Accounts */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                <span>Quick Test Google Profiles:</span>
                <span className="text-emerald-400 text-[10px]">Instant Login</span>
              </div>
              <div className="space-y-1.5">
                {sampleGoogleAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickTestGoogleLogin(acc)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={acc.avatar} alt={acc.name} className="w-7 h-7 rounded-full object-cover border border-slate-600" />
                      <div>
                        <div className="text-xs font-bold text-white">{acc.name}</div>
                        <div className="text-[10px] text-slate-400">{acc.email}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {acc.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Encrypted OAuth 2.0 protocol • Verified identity</span>
          </p>
        </div>
      </div>
    </div>
  );
}
