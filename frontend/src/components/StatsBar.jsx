import React from 'react';
import { Building2, ShieldCheck, Flame, Users, CheckCircle2 } from 'lucide-react';

export default function StatsBar({ stats }) {
  const items = [
    {
      icon: <Building2 className="w-5 h-5 text-emerald-400" />,
      value: stats?.totalListings ? `${stats.totalListings}+` : '10+',
      label: 'Active Rental Listings',
      sub: 'Dhaka & Chittagong',
    },
    {
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      value: stats?.lineGasCount ? `${stats.lineGasCount}` : '7+',
      label: 'Titas Line Gas Homes',
      sub: 'Zero cylinder hassle',
    },
    {
      icon: <Users className="w-5 h-5 text-sky-400" />,
      value: stats?.bachelorFriendly ? `${stats.bachelorFriendly}` : '4+',
      label: 'Bachelor / Student Friendly',
      sub: 'Hassle-free landlords',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-teal-400" />,
      value: '0% Middleman',
      label: 'Direct Landlord Connect',
      sub: 'Direct phone & WhatsApp',
    },
  ];

  return (
    <section className="w-full max-w-[95vw] xl:max-w-[1720px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 mb-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel rounded-3xl p-6 sm:p-7 flex items-center gap-5 hover:border-slate-700 transition-colors shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-900/95 border border-slate-800 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">{item.label}</div>
              <div className="text-xs text-slate-400 hidden sm:block mt-0.5">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
