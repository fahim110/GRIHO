import React, { useState } from 'react';
import { Home, Heart, PlusCircle, MapPin, Search, Building2, Calculator, Users, Globe, FileText, User, LogIn, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
  onOpenAuth,
  onOpenProfile,
}) {
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const t = translations[lang] || translations.en;

  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'All'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                GRIHO
              </span>
              <span className="font-bengali text-lg font-bold text-emerald-400">গৃহ</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                {t.bdVerified}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* City Selector Pill */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/70 hover:border-emerald-500/50 text-xs font-semibold text-slate-200 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{selectedCity === 'All' ? (lang === 'bn' ? '🇧🇩 সারা বাংলাদেশ' : 'All Bangladesh') : selectedCity}</span>
            <span className="text-slate-400 text-[10px]">▼</span>
          </button>

          {isCityMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-44 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-50 animate-fade-in">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onCityChange(city);
                    setIsCityMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-600/15 transition-colors ${
                    selectedCity === city ? 'text-emerald-400 font-bold bg-emerald-950/40' : 'text-slate-300'
                  }`}
                >
                  <span>{city === 'All' ? '🇧🇩 All Bangladesh' : city}</span>
                  {selectedCity === city && <span className="text-emerald-400 text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Quick Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
          <button
            onClick={onScrollToExplore}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.browseFlats}</span>
          </button>
          
          <button
            onClick={onScrollToRoommates}
            className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.roommateFinder}</span>
          </button>

          <button
            onClick={onOpenCalculator}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.affordabilityCalc}</span>
          </button>

          <button
            onClick={onOpenLease}
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.leaseGenerator}</span>
          </button>
        </nav>

        {/* Action Controls & User Auth */}
        <div className="flex items-center gap-2.5">
          
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all"
            title="Switch Language (বাংলা / English)"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Compare Button */}
          {compareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="relative px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-md animate-fade-in"
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
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all"
            title={t.savedFlats}
          >
            <Heart className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {savedCount}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          {isLoggedIn ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 transition-all text-xs font-semibold text-slate-200"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline truncate max-w-[90px]">{user.name.split(' ')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold hidden md:inline">
                {user.role === 'landlord' ? 'Landlord' : 'Tenant'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? 'লগইন' : 'Sign In'}</span>
            </button>
          )}

          {/* Post Property CTA */}
          <button
            onClick={onOpenPostModal}
            className="btn-primary flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-emerald-500/25 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.postProperty}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
