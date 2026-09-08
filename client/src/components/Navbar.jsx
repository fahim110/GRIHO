import React, { useState } from 'react';
import { Home, Heart, PlusCircle, MapPin, Search, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export default function Navbar({
  selectedCity,
  onCityChange,
  savedCount,
  onOpenSaved,
  onOpenPostModal,
  onScrollToExplore,
}) {
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);

  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'All'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                GRIHO
              </span>
              <span className="font-bengali text-lg font-bold text-emerald-400">গৃহ</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                BD Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Modern Home & Flat Rentals in Bangladesh
            </p>
          </div>
        </div>

        {/* City Selector Pill */}
        <div className="relative">
          <button
            onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/70 hover:border-emerald-500/50 text-xs font-semibold text-slate-200 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{selectedCity === 'All' ? 'All Bangladesh' : selectedCity}</span>
            <span className="text-slate-400 text-[10px]">▼</span>
          </button>

          {isCityMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1.5 z-50 animate-fade-in">
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
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={onScrollToExplore}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Browse Flats</span>
          </button>
          <a
            href="#neighborhoods"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>Dhaka & CTG Areas</span>
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Saved / Bookmarks */}
          <button
            onClick={onOpenSaved}
            className="relative p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all"
            title="Saved Flats"
          >
            <Heart className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                {savedCount}
              </span>
            )}
          </button>

          {/* Post Property CTA */}
          <button
            onClick={onOpenPostModal}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Post Property</span>
            <span className="sm:hidden font-bengali">পোস্ট</span>
          </button>
        </div>

      </div>
    </header>
  );
}
