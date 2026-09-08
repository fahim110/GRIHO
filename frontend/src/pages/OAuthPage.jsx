import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, ExternalLink, Key, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchAuthConfig } from '../api';

export default function OAuthPage() {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  const role = searchParams.get('role') || 'tenant';
  const isPopup = searchParams.get('popup') === 'true';

  const googleBtnRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);

  const [googleClientId, setGoogleClientId] = useState(() => {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('griho_google_client_id') || '';
  });

  useEffect(() => {
    if (!googleClientId) {
      fetchAuthConfig().then((cfg) => {
        if (cfg?.googleClientId) {
          setGoogleClientId(cfg.googleClientId);
          try {
            localStorage.setItem('griho_google_client_id', cfg.googleClientId);
          } catch {
            // ignore
          }
        }
      });
    }
  }, [googleClientId]);

  const [customInputId, setCustomInputId] = useState('');


  // Check for incoming OAuth redirect tokens in URL hash or query params
  useEffect(() => {
    const hash = window.location.hash;
    const query = new URLSearchParams(window.location.search);

    const tokenFromQuery = query.get('credential') || query.get('id_token');
    const codeFromQuery = query.get('code');
    let tokenFromHash = null;

    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      tokenFromHash = hashParams.get('id_token') || hashParams.get('access_token');
    }

    const incomingToken = tokenFromQuery || tokenFromHash;

    if (incomingToken) {
      handleCompleteAuth({ credential: incomingToken });
    } else if (codeFromQuery) {
      handleCompleteAuth({ code: codeFromQuery, redirectUri: window.location.origin + '/oauth/google' });
    }
  }, []);

  const handleCompleteAuth = async (authPayload) => {
    setLoading(true);
    setStatusMessage('Authenticating genuine Google session with GRIHO server...');
    setError(null);

    try {
      const user = await googleLogin({
        ...authPayload,
        role,
      });

      setStatusMessage(`Welcome ${user.name}! Redirecting to GRIHO dashboard...`);

      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          {
            type: 'GRIHO_OAUTH_SUCCESS',
            provider: 'google',
            user,
          },
          window.location.origin
        );
        setTimeout(() => window.close(), 600);
      } else {
        setTimeout(() => navigate('/dashboard'), 600);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  // Initialize genuine Google Identity Services (GIS)
  useEffect(() => {
    if (!googleClientId) return;

    let checkInterval = null;
    const initGIS = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (res) => {
              if (res?.credential) {
                handleCompleteAuth({ credential: res.credential });
              }
            },
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

          window.google.accounts.id.prompt();
        } catch (e) {
          console.error('GIS initialization error:', e);
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

  const handleSaveGoogleClientId = (e) => {
    e.preventDefault();
    if (!customInputId.trim()) return;
    localStorage.setItem('griho_google_client_id', customInputId.trim());
    setGoogleClientId(customInputId.trim());
    setError(null);
  };

  return (
    <div className={`w-full min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 bg-slate-950 font-sans relative overflow-hidden ${isPopup ? 'p-3' : ''}`}>
      
      {/* Background glow orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-40 bg-emerald-500/20" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-40 bg-sky-500/20" />

      {/* Top Bar (Only if not a popup) */}
      {!isPopup && (
        <div className="w-full max-w-xl mx-auto flex items-center justify-between py-2 z-10">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to GRIHO</span>
          </Link>
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
            Google OAuth 2.0
          </span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="w-full max-w-md my-auto relative z-10 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-white">
        
        {/* Google OAuth Section */}
        <div className="space-y-5">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-md">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Sign in with Google
            </h1>
            <p className="text-xs text-slate-400">
              Official authentication using Google Identity Services
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-200">{statusMessage}</p>
            </div>
          ) : googleClientId ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-center">
              <div className="text-xs text-slate-300">Sign in with your Google account:</div>
              <div className="flex justify-center min-h-[44px]">
                <div ref={googleBtnRef} id="google-oauth-page-btn" className="inline-block" />
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    const redirectUri = encodeURIComponent(window.location.origin + '/oauth/google');
                    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(googleClientId)}&redirect_uri=${redirectUri}&response_type=token%20id_token&scope=openid%20profile%20email&nonce=${Date.now()}`;
                  }}
                  className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Direct Google accounts consent window</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Key className="w-4 h-4" />
                  <span>Google OAuth Client ID Required</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  To sign in with real Google accounts, configure your Google OAuth Client ID:
                </p>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <span>Google Cloud Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <form onSubmit={handleSaveGoogleClientId} className="space-y-2">
                <input
                  type="text"
                  placeholder="Paste Google Client ID here..."
                  value={customInputId}
                  onChange={(e) => setCustomInputId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
                <button
                  type="submit"
                  className="btn-primary w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Save & Initialize Google Sign-In
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>GRIHO Bangladesh Secure Google Authentication</span>
          </p>
        </div>

      </div>

    </div>
  );
}
