import React from 'react';
import { Home, Heart, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ onOpenPostModal, onSelectArea }) {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">GRIHO</span>
              <span className="font-bengali text-lg font-bold text-emerald-400">গৃহ</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Bangladesh's trusted housing and apartment rental discovery network. Connecting verified landlords directly with families, bachelors, and professionals.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Direct Landlords • Zero Hidden Brokerage</span>
            </div>
          </div>

          {/* Col 2: Top Dhaka Areas */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Popular Dhaka Locations
            </h4>
            <ul className="space-y-1.5">
              {['Gulshan 2', 'Dhanmondi', 'Bashundhara R/A', 'Uttara', 'Banani', 'Mirpur DOHS'].map((area) => (
                <li key={area}>
                  <button
                    onClick={() => onSelectArea(area)}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    Flats in {area}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Rental Types */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Rental Categories
            </h4>
            <ul className="space-y-1.5">
              <li><span className="text-slate-300">👨‍👩‍👦 Family Apartments (পরিবার বাসা)</span></li>
              <li><span className="text-slate-300">🎓 Bachelor Sublets (ব্যাচেলর সাবলেট)</span></li>
              <li><span className="text-slate-300">👩 Female Only Rooms (ছাত্রী মেস)</span></li>
              <li><span className="text-slate-300">🏢 Studio & Duplex Penthouses</span></li>
              <li><span className="text-slate-300">🔥 Titas Line Gas Apartments</span></li>
            </ul>
          </div>

          {/* Col 4: For Landlords & Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Landlord & Host Hub
            </h4>
            <p className="text-slate-400 text-xs">
              Have an empty flat or room in Dhaka or Chittagong? List it on GRIHO to find reliable tenants fast.
            </p>
            <button
              onClick={onOpenPostModal}
              className="btn-primary w-full py-2 px-3 rounded-xl text-xs font-bold"
            >
              + Post Your Flat / Room Free
            </button>
            <div className="pt-2 text-[11px] text-slate-500">
              Support: support@grihobd.com • Hotline: +880 9610-GRIHO
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} GRIHO (গৃহ) Bangladesh. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Tenant Rights Guide</span>
            <span>•</span>
            <span>House Rent Act Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
