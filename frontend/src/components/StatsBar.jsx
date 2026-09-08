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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {item.value}
              </div>
              <div className="text-xs font-semibold text-slate-300">{item.label}</div>
              <div className="text-[11px] text-slate-400 hidden sm:block">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
