import React, { useState } from 'react';
import { X, Check, ArrowRight, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SocialOAuthModal({ isOpen, onClose, provider = 'google', initialRole = 'tenant' }) {
  if (!isOpen) return null;

  const { socialLogin } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Sample realistic Google profiles
  const sampleAccounts = [
    {
      name: 'Tanvir Ahmed',
      email: 'tanvir.ahmed.bd@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      role: 'tenant',
      roleLabel: 'Tenant Profile (ভাড়াটিয়া)',
    },
    {
      name: 'Fahim Chowdhury',
      email: 'chowdhury.properties@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
      role: 'landlord',
      roleLabel: 'Landlord Profile (বাড়িওয়ালা)',
    },
  ];

  const handleSelectAccount = async (acc) => {
    setSelectedAccount(acc.email);
    setLoading(true);
    setStatusMessage('Connecting to Google...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatusMessage('Authenticating with GRIHO Bangladesh...');
      
      await socialLogin({
        provider: 'google',
        name: acc.name,
        email: acc.email,
        avatar: acc.avatar || '',
        role: acc.role || initialRole,
      });

      setStatusMessage('Authentication successful! Redirecting to Dashboard...');
      await new Promise((resolve) => setTimeout(resolve, 500));

      setLoading(false);
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setStatusMessage(err.message || 'Authentication failed. Please try again.');
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail) return;
    await handleSelectAccount({
      name: customName || customEmail.split('@')[0],
      email: customEmail,
      role: initialRole,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden text-slate-900 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Authentication Screen */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Google Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Sign in with Google</h2>
            <p className="text-xs text-slate-500">Choose an account to continue to GRIHO Bangladesh</p>
          </div>

          {loading ? (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-600">{statusMessage}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Account List */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {sampleAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleSelectAccount(acc)}
                    className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={acc.avatar} alt={acc.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                      <div>
                        <div className="font-semibold text-sm text-slate-800 group-hover:text-emerald-600 transition-colors">{acc.name}</div>
                        <div className="text-xs text-slate-500">{acc.email}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700">
                      {acc.roleLabel}
                    </span>
                  </button>
                ))}
              </div>

              {/* Use Another Account */}
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full py-2.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors text-center cursor-pointer"
                >
                  Use another Google account
                </button>
              ) : (
                <form onSubmit={handleCustomSubmit} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-700">Enter custom Google email:</div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 cursor-pointer"
                    >
                      Continue
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>GRIHO Bangladesh Secure Google Authentication</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
