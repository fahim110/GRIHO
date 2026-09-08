import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight, RefreshCw, X, ShieldCheck, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OtpVerificationModal({
  isOpen,
  onClose,
  email,
  emailSent = true,
  onSuccess,
}) {
  if (!isOpen) return null;

  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [currentEmailSent, setCurrentEmailSent] = useState(emailSent);

  const inputRefs = useRef([]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Focus the first input box when modal opens
  useEffect(() => {
    if (inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, []);

  const handleDigitChange = (index, value) => {
    // Only accept numeric digit
    const char = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);
    setError(null);

    // Auto-advance to next input if digit entered
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        // Move to previous input on backspace
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    const cleanNumbers = pasteData.replace(/\D/g, '').slice(0, 6);
    if (cleanNumbers.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = cleanNumbers[i] || '';
      }
      setOtpDigits(newDigits);
      const focusIndex = Math.min(cleanNumbers.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const otpCode = otpDigits.join('');

    if (otpCode.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await verifyOtp(email, otpCode);
      setLoading(false);
      setSuccessMsg('Email verified successfully! Welcome to GRIHO.');

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(user);
        } else {
          onClose();
          navigate('/dashboard');
        }
      }, 700);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Invalid or expired OTP. Please try again.');
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setError(null);

    try {
      const data = await resendOtp(email);
      setIsResending(false);
      setCanResend(false);
      setResendTimer(60);
      setSuccessMsg(data.message || 'A new verification code has been dispatched.');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setIsResending(false);
      setError(err.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in font-sans">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-[28px] shadow-2xl overflow-hidden p-6 sm:p-7 text-white"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-13 h-13 mx-auto rounded-2xl bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Mail className="w-6 h-6 text-emerald-400" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Verify Your Email
          </h2>
          <div className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            We sent a 6-digit verification code to <br />
            <span className="font-bold text-white font-mono">{email}</span>
          </div>
        </div>

        {/* Alerts */}
        {!currentEmailSent && (
          <div className="mt-4 p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 animate-fade-in text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block text-amber-300">Live Gmail Delivery Setup:</span>
              To send verification codes directly to real inboxes, please set <code className="bg-amber-900/60 px-1 py-0.5 rounded text-[11px] font-mono">GMAIL_USER</code> and <code className="bg-amber-900/60 px-1 py-0.5 rounded text-[11px] font-mono">GMAIL_APP_PASSWORD</code> in your <code className="bg-amber-900/60 px-1 py-0.5 rounded text-[11px] font-mono">.env</code> file. (Backend console logs OTP for testing while setting up).
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 6 OTP Input Boxes */}
        <form onSubmit={handleVerify} className="mt-6 space-y-5">
          <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-11 h-12 sm:w-12 sm:h-14 rounded-xl text-center text-xl font-black font-mono transition-all border outline-none ${
                  digit
                    ? 'bg-slate-950 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950/80 border-slate-700 text-white focus:border-emerald-400 focus:bg-slate-950'
                }`}
              />
            ))}
          </div>

          {/* Submit Verification Button */}
          <button
            type="submit"
            disabled={loading || otpDigits.join('').length < 6}
            className="btn-primary w-full py-3 min-h-[48px] rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Sign In (যাচাই করুন)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Resend OTP Section */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-center space-y-3">
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <span>Didn't receive the code?</span>
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-emerald-400 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                <span>Resend Code</span>
              </button>
            ) : (
              <span className="text-slate-500 font-mono font-semibold">
                Resend in {resendTimer}s
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            Please check your email <span className="text-white font-semibold">Inbox</span>, <span className="text-white font-semibold">Spam</span>, or <span className="text-white font-semibold">Promotions</span> folder.
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-500">
            🔒 Protected by GRIHO Bangladesh 256-bit security encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
