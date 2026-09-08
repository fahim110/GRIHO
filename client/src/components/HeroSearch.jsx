import React from 'react';
import { Search, MapPin, Building, Users, Banknote, Flame, Sparkles } from 'lucide-react';

export default function HeroSearch({
  filters,
  onFilterChange,
  onSearchSubmit,
  onQuickSelect,
}) {
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
    { label: '🔥 Titas Line Gas Flats', filter: { gasType: 'Titas Line Gas' } },
    { label: '🎓 Bachelor Friendly (Bashundhara)', filter: { area: 'Bashundhara R/A', tenantPolicy: 'Bachelor' } },
    { label: '✨ Under ৳25,000/mo', filter: { maxRent: 25000 } },
    { label: '👩 Female Sublet Room', filter: { tenantPolicy: 'Bachelor (Female)' } },
    { label: '🏢 Luxury with Lift & Generator', filter: { lift: true, generatorBackup: true } },
  ];

  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Decorative Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Headline */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Bangladesh's Smartest House Rental Platform</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Find Your Next Home <br className="hidden sm:inline" />
          in <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">Bangladesh</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
          Explore verified family apartments, bachelor sublets, and studio flats with transparent rent, utility costs, and direct landlord contact.
        </p>
      </div>

      {/* Search Filter Card */}
      <div className="glass-panel-glow rounded-3xl p-4 sm:p-6 max-w-5xl mx-auto shadow-2xl">
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
              <span>Location / Neighborhood</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Gulshan, Dhanmondi, Uttara"
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
              <span>Property Type</span>
            </label>
            <select
              value={filters.propertyType || 'All'}
              onChange={(e) => onFilterChange('propertyType', e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm bg-slate-900 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Family Apartment">Family Apartment (ফ্যামিলি)</option>
              <option value="Bachelor Sublet">Bachelor Sublet (সাবলেট)</option>
              <option value="Mess / Room">Mess / Room (মেস রুম)</option>
              <option value="Studio Flat">Studio Flat (স্টুডিও)</option>
              <option value="Duplex House">Duplex House (ডুপ্লেক্স)</option>
            </select>
          </div>

          {/* Tenant Policy */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Tenant Policy</span>
            </label>
            <select
              value={filters.tenantPolicy || 'All'}
              onChange={(e) => onFilterChange('tenantPolicy', e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm bg-slate-900 cursor-pointer"
            >
              <option value="All">Anyone (সবাই)</option>
              <option value="Family">Family Only (পরিবার)</option>
              <option value="Bachelor">Bachelor Friendly (ব্যাচেলর)</option>
              <option value="Bachelor (Female)">Female Only (ছাত্রী/মহিলা)</option>
              <option value="Bachelor (Male)">Male Bachelor (ছেলে ব্যাচেলর)</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              className="btn-primary w-full py-2.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 h-[42px] cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Find Rental Homes</span>
            </button>
          </div>
        </form>

        {/* Quick Tag Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Popular:</span>
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
