import React from 'react';
import { Search, MapPin, Building, Users, Banknote, Flame, Sparkles, Train, Calculator, FileText } from 'lucide-react';
import { translations } from '../translations';

export default function HeroSearch({
  filters,
  onFilterChange,
  onSearchSubmit,
  onQuickSelect,
  onOpenCalculator,
  onOpenLease,
  lang = 'en',
}) {
  const t = translations[lang] || translations.en;

  const popularAreas = [
    'Gulshan 2',
    'Dhanmondi',
    'Bashundhara R/A',
    'Uttara',
    'Mirpur DOHS',
    'Banani',
    'Mohammadpur',
    'Nasirabad Housing Society',
  ];

  const quickTags = [
    { label: t.titasGasFilter, filter: { gasType: 'Titas Line Gas' } },
    { label: t.bachelorTag, filter: { area: 'Bashundhara R/A', tenantPolicy: 'Bachelor' } },
    { label: t.budgetTag, filter: { maxRent: 25000 } },
    { label: t.femaleSubletTag, filter: { tenantPolicy: 'Bachelor (Female)' } },
    { label: t.metroTag, filter: { search: 'Metro' } },
  ];

  return (
    <section className="relative pt-16 pb-24 px-4 sm:px-8 lg:px-12 2xl:px-16 max-w-[95vw] xl:max-w-[1720px] 2xl:max-w-[1920px] mx-auto w-full overflow-hidden">
      
      {/* Background Pure CSS Aurora Mesh & Blueprint */}
      <div className="absolute inset-0 -z-20 overflow-hidden rounded-3xl opacity-60">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-sky-950/30" />
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-emerald-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-blueprint-grid)" />
        </svg>
      </div>

      {/* Decorative Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Main Headline */}
      <div className="text-center max-w-5xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-xl backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{t.heroTag}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6">
          {t.heroTitle1} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
            {t.heroTitle2}
          </span>
        </h1>
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={onOpenCalculator}
            className="px-6 py-3 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/80 text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all shadow-lg backdrop-blur-md cursor-pointer hover:scale-105"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'bn' ? 'আয় অনুযায়ী বাজেট হিসাব করুন' : 'Rent Affordability Calculator'}</span>
          </button>
          <button
            onClick={onOpenLease}
            className="px-6 py-3 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-amber-300 hover:bg-amber-950/80 text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all shadow-lg backdrop-blur-md cursor-pointer hover:scale-105"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>{lang === 'bn' ? 'ভাড়া চুক্তিপত্র তৈরি করুন' : 'Tenancy Agreement Helper'}</span>
          </button>
        </div>
      </div>

      {/* Search Filter Card */}
      <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 max-w-6xl 2xl:max-w-7xl mx-auto shadow-2xl backdrop-blur-2xl space-y-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Location / Area */}
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{t.locationLabel}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={filters.area || ''}
                onChange={(e) => onFilterChange('area', e.target.value)}
                className="w-full glass-input rounded-2xl px-5 py-4 text-base placeholder:text-slate-500"
                list="popular-areas-list"
              />
              <datalist id="popular-areas-list">
                {popularAreas.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-400" />
              <span>{t.propertyTypeLabel}</span>
            </label>
            <select
              value={filters.propertyType || 'All'}
              onChange={(e) => onFilterChange('propertyType', e.target.value)}
              className="w-full glass-input rounded-2xl px-5 py-4 text-base bg-slate-900 cursor-pointer"
            >
              <option value="All">{t.allTypes}</option>
              <option value="Family Apartment">{t.familyApartment}</option>
              <option value="Bachelor Sublet">{t.bachelorSublet}</option>
              <option value="Mess / Room">{t.messRoom}</option>
              <option value="Studio Flat">{t.studioFlat}</option>
              <option value="Duplex House">{t.duplexHouse}</option>
            </select>
          </div>

          {/* Tenant Policy */}
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>{t.tenantPolicyLabel}</span>
            </label>
            <select
              value={filters.tenantPolicy || 'All'}
              onChange={(e) => onFilterChange('tenantPolicy', e.target.value)}
              className="w-full glass-input rounded-2xl px-5 py-4 text-base bg-slate-900 cursor-pointer"
            >
              <option value="All">{t.allTenants}</option>
              <option value="Family">{t.familyOnly}</option>
              <option value="Bachelor">{t.bachelorFriendly}</option>
              <option value="Bachelor (Female)">{t.femaleOnly}</option>
              <option value="Bachelor (Male)">{t.maleBachelor}</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              className="btn-primary w-full py-4 px-8 rounded-2xl font-black text-base flex items-center justify-center gap-3 h-[58px] cursor-pointer shadow-xl shadow-emerald-500/30"
            >
              <Search className="w-5 h-5" />
              <span>{t.findHomesBtn}</span>
            </button>
          </div>
        </form>

        {/* Quick Tag Pills */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs sm:text-sm font-bold text-slate-400 mr-2 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>{t.popularTags}</span>
          </span>
          {quickTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => onQuickSelect(tag.filter)}
              className="text-xs sm:text-sm font-bold px-4.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-emerald-300 hover:border-emerald-500/50 hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
