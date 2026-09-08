import React from 'react';
import { Home, Heart, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ onOpenPostModal, onSelectArea }) {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-sm">
      <div className="w-full max-w-[95vw] xl:max-w-[1720px] 2xl:max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Home className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">GRIHO</span>
              <span className="font-bengali text-xl font-bold text-emerald-400">গৃহ</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bangladesh's trusted housing and apartment rental discovery network. Connecting verified landlords directly with families, bachelors, and professionals.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Direct Landlords • Zero Hidden Brokerage</span>
            </div>
          </div>

          {/* Col 2: Top Dhaka Areas */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
              Popular Dhaka Locations
            </h4>
            <ul className="space-y-2">
              {['Gulshan 2', 'Dhanmondi', 'Bashundhara R/A', 'Uttara', 'Banani', 'Mirpur DOHS'].map((area) => (
                <li key={area}>
                  <button
                    onClick={() => onSelectArea(area)}
                    className="hover:text-emerald-400 transition-colors text-left font-medium cursor-pointer"
                  >
                    Flats in {area}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Rental Types */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
              Rental Categories
            </h4>
            <ul className="space-y-2">
              <li><span className="text-slate-300 font-medium">👨‍👩‍👦 Family Apartments (পরিবার বাসা)</span></li>
              <li><span className="text-slate-300 font-medium">🎓 Bachelor Sublets (ব্যাচেলর সাবলেট)</span></li>
              <li><span className="text-slate-300 font-medium">👩 Female Only Rooms (ছাত্রী মেস)</span></li>
              <li><span className="text-slate-300 font-medium">🏢 Studio & Duplex Penthouses</span></li>
              <li><span className="text-slate-300 font-medium">🔥 Titas Line Gas Apartments</span></li>
            </ul>
          </div>

          {/* Col 4: For Landlords & Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
              Landlord & Host Hub
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Have an empty flat or room in Dhaka or Chittagong? List it on GRIHO to find reliable tenants fast.
            </p>
            <button
              onClick={onOpenPostModal}
              className="btn-primary w-full py-3 px-4 rounded-2xl text-sm font-bold cursor-pointer shadow-lg shadow-emerald-500/30"
            >
              + Post Your Flat / Room Free
            </button>
            <div className="pt-2 text-xs text-slate-500">
              Support: support@grihobd.com • Hotline: +880 9610-GRIHO
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs sm:text-sm">
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
