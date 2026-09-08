import React from 'react';
import { MapPin, ArrowRight, Building } from 'lucide-react';

export default function PopularNeighborhoods({ onSelectArea }) {
  const neighborhoods = [
    {
      name: 'Gulshan 2',
      tag: 'Diplomatic Zone & Luxury',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      avgPrice: '৳1,20,000/mo',
      city: 'Dhaka',
    },
    {
      name: 'Dhanmondi',
      tag: 'Lakeside & Top Schools',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      avgPrice: '৳48,000/mo',
      city: 'Dhaka',
    },
    {
      name: 'Bashundhara R/A',
      tag: 'NSU/IUB & Bachelor Hub',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
      avgPrice: '৳28,000/mo',
      city: 'Dhaka',
    },
    {
      name: 'Uttara',
      tag: 'Metro Rail & Quiet Living',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
      avgPrice: '৳36,000/mo',
      city: 'Dhaka',
    },
    {
      name: 'Banani',
      tag: 'Chic Dining & Penthouses',
      image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
      avgPrice: '৳1,75,000/mo',
      city: 'Dhaka',
    },
    {
      name: 'Nasirabad Housing Society',
      tag: 'Chittagong Prime Green Hills',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
      avgPrice: '৳38,000/mo',
      city: 'Chittagong',
    },
  ];

  return (
    <section id="neighborhoods" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            <Building className="w-4 h-4" />
            <span>Prime Rental Hubs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore by Top Neighborhoods
          </h2>
        </div>
        <p className="text-sm text-slate-400 mt-2 sm:mt-0 max-w-md">
          Discover flats with specific local perks: close to university, metro station, or secured gated communities.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {neighborhoods.map((n, idx) => (
          <div
            key={idx}
            onClick={() => onSelectArea(n.name)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer border border-slate-800 bg-slate-900 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/40"
          >
            {/* Image & Gradient */}
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src={n.image}
                alt={n.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-3 flex flex-col justify-between">
              <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700/60">
                {n.city}
              </span>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                  {n.name}
                </h3>
                <p className="text-[11px] text-slate-400 truncate">{n.tag}</p>
                <div className="mt-1 flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                  <span>Avg {n.avgPrice}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
