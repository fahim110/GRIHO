import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Heart,
  PlusCircle,
  MapPin,
  Search,
  Building2,
  Calculator,
  Users,
  Globe,
  FileText,
  User,
  LogIn,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../translations';

export default function Navbar({
  selectedCity,
  onCityChange,
  savedCount,
  onOpenSaved,
  onOpenPostModal,
  onScrollToExplore,
  onOpenCalculator,
  onOpenLease,
  onScrollToRoommates,
  compareCount = 0,
  onOpenCompare,
  lang = 'en',
  onToggleLang,
}) {
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const { currentPreset, presets, selectPreset, activeThemeId } = useTheme();
  const navigate = useNavigate();
  const t = translations[lang] || translations.en;

  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'All'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="w-full max-w-[95vw] xl:max-w-[1720px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 h-24 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3.5 cursor-pointer shrink-0 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <Home className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                GRIHO
              </span>
              <span className="font-bengali text-xl font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-xl border border-emerald-500/30">
                গৃহ
              </span>
              <span className="hidden sm:inline-block text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                {t.bdVerified}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              {t.brandSubtitle}
            </p>
          </div>
        </Link>

        {/* City Selector Pill */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900 border border-slate-700/70 hover:border-emerald-500/50 text-xs sm:text-sm font-bold text-slate-200 transition-colors cursor-pointer shadow-sm"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{selectedCity === 'All' ? (lang === 'bn' ? '🇧🇩 সারা বাংলাদেশ' : 'All Bangladesh') : selectedCity}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {isCityMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 animate-fade-in">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onCityChange(city);
                    setIsCityMenuOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-xs sm:text-sm font-semibold flex items-center justify-between hover:bg-emerald-600/15 transition-colors cursor-pointer ${
                    selectedCity === city ? 'text-emerald-400 font-bold bg-emerald-950/40' : 'text-slate-300'
                  }`}
                >
                  <span>{city === 'All' ? '🇧🇩 All Bangladesh' : city}</span>
                  {selectedCity === city && <span className="text-emerald-400 text-sm font-black">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Quick Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-300">
          <button
            onClick={onScrollToExplore}
            className="hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span>{t.browseFlats}</span>
          </button>
          
          <button
            onClick={onScrollToRoommates}
            className="hover:text-sky-400 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-sky-400" />
            <span>{t.roommateFinder}</span>
          </button>

          <button
            onClick={onOpenCalculator}
            className="hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>{t.affordabilityCalc}</span>
          </button>

          <button
            onClick={onOpenLease}
            className="hover:text-amber-400 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>{t.leaseGenerator}</span>
          </button>
        </nav>

        {/* Action Controls & User Auth */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Switch Language (বাংলা / English)"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Theme Quick Cycler */}
          <button
            onClick={() => {
              const currentIndex = presets.findIndex((p) => p.id === activeThemeId);
              const nextIndex = (currentIndex + 1) % presets.length;
              selectPreset(presets[nextIndex].id);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all cursor-pointer shadow-sm group"
            title={`Active Theme: ${currentPreset?.name} (Click to cycle themes)`}
          >
            <span className="text-sm leading-none">{currentPreset?.icon}</span>
            <span className="hidden xl:inline">{currentPreset?.name?.split(' ')[0]}</span>
          </button>

          {/* Compare Button */}
          {compareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="relative px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md animate-fade-in cursor-pointer"
            >
              <span>⚖️ {t.compareFlats}</span>
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {compareCount}
              </span>
            </button>
          )}

          {/* Saved / Bookmarks */}
          <button
            onClick={onOpenSaved}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all cursor-pointer shadow-sm"
            title={t.savedFlats}
          >
            <Heart className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {savedCount}
              </span>
            )}
          </button>

          {/* Post Property CTA */}
          <button
            onClick={onOpenPostModal}
            className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer shadow-lg shadow-emerald-500/30 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.postProperty}</span>
          </button>

          {/* User Dashboard / Auth Section (At the Extreme Right Corner) */}
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 p-1.5 pr-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-900 border border-emerald-500/50 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 transition-all text-xs sm:text-sm font-bold text-slate-100 cursor-pointer shadow-md shrink-0 group ml-1"
              title="Go to Your Dashboard"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-left hidden sm:block leading-tight">
                <div className="text-[10px] text-emerald-400 uppercase font-extrabold tracking-wider">Dashboard</div>
                <div className="font-bold truncate max-w-[90px] text-xs text-white">{user?.name?.split(' ')[0]}</div>
              </div>
              <LayoutDashboard className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all cursor-pointer shadow-md shrink-0 ml-1"
            >
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'লগইন' : 'Sign In'}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
