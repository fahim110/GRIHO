import React from 'react';
import { MapPin, ArrowRight, Building, Compass, Sparkles } from 'lucide-react';

export default function PopularNeighborhoods({ onSelectArea }) {
  const neighborhoods = [
    {
      name: 'Gulshan 2',
      tag: 'Diplomatic Zone & Luxury',
      avgPrice: '৳1,20,000/mo',
      city: 'Dhaka',
      gradient: 'from-amber-950/80 via-slate-900 to-slate-950',
      badgeColor: 'text-amber-400 border-amber-500/30',
      icon: '🏛️',
    },
    {
      name: 'Dhanmondi',
      tag: 'Lakeside & Top Schools',
      avgPrice: '৳48,000/mo',
      city: 'Dhaka',
      gradient: 'from-emerald-950/80 via-slate-900 to-slate-950',
      badgeColor: 'text-emerald-400 border-emerald-500/30',
      icon: '🌿',
    },
    {
      name: 'Bashundhara R/A',
      tag: 'NSU/IUB & Bachelor Hub',
      avgPrice: '৳28,000/mo',
      city: 'Dhaka',
      gradient: 'from-sky-950/80 via-slate-900 to-slate-950',
      badgeColor: 'text-sky-400 border-sky-500/30',
      icon: '🎓',
    },
    {
      name: 'Uttara',
      tag: 'Metro Rail & Quiet Living',
      avgPrice: '৳36,000/mo',
      city: 'Dhaka',
      gradient: 'from-teal-950/80 via-slate-900 to-slate-950',
      badgeColor: 'text-teal-400 border-teal-500/30',
      icon: '🚇',
    },
    {
      name: 'Banani',
      tag: 'Chic Dining & Penthouses',
      avgPrice: '৳1,75,000/mo',
      city: 'Dhaka',
      gradient: 'from-purple-950/80 via-slate-900 to-slate-950',
      badgeColor: 'text-purple-400 border-purple-500/30',
      icon: '✨',
    },
    {
      name: 'Nasirabad H/S',
      tag: 'Chittagong Green Hills',
      avgPrice: '৳38,000/mo',
      city: 'Chittagong',
      gradient: 'from-indigo-950/80 via-slate-900 to-slate-950',
      badgeColor: 'text-indigo-400 border-indigo-500/30',
      icon: '⛰️',
    },
  ];

  return (
    <section id="neighborhoods" className="w-full max-w-[95vw] xl:max-w-[1720px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 mb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            <Building className="w-4 h-4" />
            <span>Prime Rental Hubs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Explore by Top Neighborhoods
          </h2>
        </div>
        <p className="text-sm text-slate-400 mt-2 sm:mt-0 max-w-md font-medium">
          Discover flats with specific local perks: close to university, metro station, or secured gated communities.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {neighborhoods.map((n, idx) => (
          <div
            key={idx}
            onClick={() => onSelectArea(n.name.includes('Nasirabad') ? 'Nasirabad Housing Society' : n.name)}
            className={`group relative rounded-3xl overflow-hidden cursor-pointer border border-slate-800/90 bg-gradient-to-br ${n.gradient} p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/50 hover:-translate-y-1.5 min-h-[190px]`}
          >
            {/* Ambient Blueprint Overlay */}
            <svg
              className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id={`neigh-grid-${idx}`} width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-slate-300" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#neigh-grid-${idx})`} />
            </svg>

            {/* Top Row: City Badge & Icon */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
                {n.city}
              </span>
              <span className="text-2xl">{n.icon}</span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 pt-4">
              <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                {n.name}
              </h3>
              <p className="text-xs text-slate-400 truncate mt-0.5">{n.tag}</p>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-emerald-400 pt-2 border-t border-slate-800/80">
                <span>Avg {n.avgPrice}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
