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
    <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Background Hero Image with Gradient Mask */}
      <div className="absolute inset-0 -z-20 overflow-hidden rounded-3xl opacity-30 sm:opacity-40">
        <img
          src="/hero.jpg"
          alt="Dhaka Skyline Luxury Living"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
      </div>

      {/* Decorative Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Headline */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{t.heroTag}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4">
          {t.heroTitle1} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
            {t.heroTitle2}
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
          {t.heroSubtitle}
        </p>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={onOpenCalculator}
            className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/80 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'bn' ? 'আয় অনুযায়ী বাজেট হিসাব করুন' : 'Rent Affordability Calculator'}</span>
          </button>
          <button
            onClick={onOpenLease}
            className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 hover:bg-amber-950/80 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'ভাড়া চুক্তিপত্র তৈরি করুন' : 'Tenancy Agreement Helper'}</span>
          </button>
        </div>
      </div>

      {/* Search Filter Card */}
      <div className="glass-panel-glow rounded-3xl p-4 sm:p-6 max-w-5xl mx-auto shadow-2xl backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Location / Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.locationLabel}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={filters.area || ''}
                onChange={(e) => onFilterChange('area', e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm placeholder:text-slate-500"
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
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.propertyTypeLabel}</span>
            </label>
            <select
              value={filters.propertyType || 'All'}
              onChange={(e) => onFilterChange('propertyType', e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm bg-slate-900 cursor-pointer"
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
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.tenantPolicyLabel}</span>
            </label>
            <select
              value={filters.tenantPolicy || 'All'}
              onChange={(e) => onFilterChange('tenantPolicy', e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm bg-slate-900 cursor-pointer"
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
              className="btn-primary w-full py-2.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 h-[42px] cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{t.findHomesBtn}</span>
            </button>
          </div>
        </form>

        {/* Quick Tag Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>{t.popularTags}</span>
          </span>
          {quickTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => onQuickSelect(tag.filter)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 hover:bg-slate-800/90 transition-all cursor-pointer"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
