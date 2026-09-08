import React, { useState } from 'react';
import { X, Calculator, Banknote, MapPin, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AffordabilityCalculatorModal({ isOpen, onClose, onApplyBudget, lang = 'en' }) {
  if (!isOpen) return null;

  const [monthlyIncome, setMonthlyIncome] = useState(60000);
  const [familySize, setFamilySize] = useState('2-3 Persons');
  const [preferredCity, setPreferredCity] = useState('Dhaka');

  const formatBDT = (val) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val);

  // Financial calculations
  const recommendedMaxRent = Math.round(monthlyIncome * 0.30); // 30% rule
  const safeRent = Math.round(monthlyIncome * 0.25);
  const estUtilities = 4000;
  const estFoodLiving = Math.round(monthlyIncome * 0.35);
  const estSavings = Math.max(0, monthlyIncome - recommendedMaxRent - estUtilities - estFoodLiving);

  // Area recommendations based on budget
  const getRecommendedAreas = () => {
    if (recommendedMaxRent >= 80000) {
      return ['Gulshan 2', 'Banani', 'Baridhara Diplomatic', 'Bashundhara I-Block Luxury'];
    } else if (recommendedMaxRent >= 40000) {
      return ['Dhanmondi', 'Mirpur DOHS', 'Uttara Sector 11', 'Bashundhara Block D', 'Nasirabad Chittagong'];
    } else if (recommendedMaxRent >= 20000) {
      return ['Bashundhara R/A', 'Mohammadpur', 'Mirpur-10', 'Khilgaon', 'Uttara Sector 4'];
    } else {
      return ['Bachelor Sublet Bashundhara', 'Mirpur-10 Room Seat', 'Mohammadpur Shared Flat', 'Farmgate Sublet'];
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 lg:p-10 animate-fade-in">
      <div
        className="relative w-full max-w-4xl lg:max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 sm:px-12 py-7 border-b border-slate-800 bg-slate-950/95 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Calculator className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'bn' ? 'ভাড়া ও বাজেট ক্যালকুলেটর' : 'Rent Affordability Calculator'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {lang === 'bn' ? 'আপনার আয়ের ভিত্তিতে আদর্শ বাসা ভাড়া ও এলাকা খুঁজুন' : 'Calculate safe rental budget & best areas based on your income'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-8 sm:p-12 space-y-8 text-base flex-1">
          
          {/* Income Slider / Input */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="font-extrabold text-slate-200 text-base sm:text-lg">
                {lang === 'bn' ? 'আপনার মাসিক মোট আয় (বেতন/উপার্জন):' : 'Your Total Monthly Income (BDT ৳):'}
              </label>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                ৳{formatBDT(monthlyIncome)}
              </div>
            </div>

            <input
              type="range"
              min="15000"
              max="350000"
              step="5000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full h-4 accent-emerald-500 rounded-lg cursor-pointer bg-slate-800"
            />

            <div className="flex justify-between text-xs sm:text-sm text-slate-400 font-semibold">
              <span>৳15,000 (Student / Starter)</span>
              <span>৳1,50,000 (Mid Career)</span>
              <span>৳3,50,000+ (Executive)</span>
            </div>
          </div>

          {/* Results Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-panel-glow p-8 rounded-3xl space-y-3">
              <div className="text-xs sm:text-sm font-black text-emerald-400 uppercase tracking-wider">
                {lang === 'bn' ? 'প্রস্তাবিত সর্বোচ্চ ভাড়া (৩০% নিয়ম)' : 'Recommended Max Rent (30% Rule)'}
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white">
                ৳{formatBDT(recommendedMaxRent)} <span className="text-sm font-normal text-slate-400">/ mo</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'bn' ? 'আর্থিক নিরাপত্তার জন্য আয়ের ৩০% এর বেশি ভাড়া দেওয়া অনুচিত।' : 'Keeps you financially safe while comfortably covering utilities, food, and savings.'}
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-3">
              <div className="text-xs sm:text-sm font-black text-sky-400 uppercase tracking-wider">
                {lang === 'bn' ? 'আদর্শ সাশ্রয়ী বাজেট (২৫% নিয়ম)' : 'Ultra Safe Budget (25% Rule)'}
              </div>
              <div className="text-4xl sm:text-5xl font-black text-sky-300">
                ৳{formatBDT(safeRent)} <span className="text-sm font-normal text-slate-400">/ mo</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {lang === 'bn' ? 'অতিরিক্ত সঞ্চয় ও বিনিয়োগের জন্য ২৫% সীমার বাসা নির্বাচন করুন।' : 'Enables aggressive savings and protects against sudden utility spikes.'}
              </p>
            </div>
          </div>

          {/* Monthly Budget Breakdown */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="font-extrabold text-white text-base sm:text-lg">
              {lang === 'bn' ? 'মাসিক খরচের সম্ভাব্য বিভাজন:' : 'Suggested Monthly Budget Breakdown:'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block font-bold">House Rent</span>
                <span className="font-black text-emerald-400 text-lg sm:text-xl">৳{formatBDT(recommendedMaxRent)}</span>
                <span className="text-[11px] text-slate-500 block">30%</span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block font-bold">Utilities (Gas/Power)</span>
                <span className="font-black text-amber-400 text-lg sm:text-xl">৳{formatBDT(estUtilities)}</span>
                <span className="text-[11px] text-slate-500 block">Fixed avg</span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block font-bold">Food & Living</span>
                <span className="font-black text-sky-400 text-lg sm:text-xl">৳{formatBDT(estFoodLiving)}</span>
                <span className="text-[11px] text-slate-500 block">35%</span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block font-bold">Estimated Savings</span>
                <span className="font-black text-teal-400 text-lg sm:text-xl">৳{formatBDT(estSavings)}</span>
                <span className="text-[11px] text-slate-500 block">Emergency fund</span>
              </div>
            </div>
          </div>

          {/* Recommended Areas */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>
                {lang === 'bn' ? `৳${formatBDT(recommendedMaxRent)} বাজেটে সেরা এলাকাসমূহ:` : `Best Neighborhoods for ৳${formatBDT(recommendedMaxRent)} Budget:`}
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {getRecommendedAreas().map((area, idx) => (
                <span
                  key={idx}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-emerald-300 font-bold text-sm shadow-sm"
                >
                  📍 {area}
                </span>
              ))}
            </div>
          </div>

          {/* CTA: Filter with budget */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => {
                if (onApplyBudget) onApplyBudget(recommendedMaxRent);
                onClose();
              }}
              className="btn-primary w-full py-5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-pointer shadow-xl shadow-emerald-500/30"
            >
              <span>Show Verified Flats Under ৳{formatBDT(recommendedMaxRent)}/mo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
