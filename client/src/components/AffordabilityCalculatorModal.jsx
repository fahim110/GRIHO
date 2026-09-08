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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'bn' ? 'ভাড়া ও বাজেট ক্যালকুলেটর' : 'Rent Affordability Calculator'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === 'bn' ? 'আপনার আয়ের ভিত্তিতে আদর্শ বাসা ভাড়া ও এলাকা খুঁজুন' : 'Calculate safe rental budget & best areas based on your income'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 text-xs flex-1">
          
          {/* Income Slider / Input */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-300">
                {lang === 'bn' ? 'আপনার মাসিক মোট আয় (মাসিক বেতন/রোজগার):' : 'Your Total Monthly Income:'}
              </label>
              <div className="text-lg font-extrabold text-emerald-400">
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
              className="w-full accent-emerald-500 cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-500">
              <span>৳15,000 (Student / Starter)</span>
              <span>৳1,50,000</span>
              <span>৳3,50,000+ (Executive)</span>
            </div>
          </div>

          {/* Results Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel-glow p-4 rounded-2xl space-y-1.5">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                {lang === 'bn' ? 'প্রস্তাবিত সর্বোচ্চ ভাড়া (৩০% নিয়ম)' : 'Recommended Max Rent (30% Rule)'}
              </div>
              <div className="text-2xl font-black text-white">
                ৳{formatBDT(recommendedMaxRent)} <span className="text-xs font-normal text-slate-400">/ mo</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {lang === 'bn' ? 'আর্থিক নিরাপত্তার জন্য আয়ের ৩০% এর বেশি ভাড়া দেওয়া অনুচিত।' : 'Keeps you financially safe while covering utilities and savings.'}
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                {lang === 'bn' ? 'মাসিক সম্ভাব্য সঞ্চয়' : 'Estimated Monthly Savings'}
              </div>
              <div className="text-2xl font-black text-sky-300">
                ৳{formatBDT(estSavings)} <span className="text-xs font-normal text-slate-400">/ mo</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'bn' ? 'ভাড়া ও ইউটিলিটি পরিশোধের পর আনুমানিক অবশিষ্ট।' : 'Leftover for personal investments and emergency savings.'}
              </p>
            </div>
          </div>

          {/* Monthly Budget Breakdown */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              {lang === 'bn' ? 'মাসিক খরচের আনুমানিক বিন্যাস' : 'Recommended Monthly Budget Breakdown'}
            </h3>
            <div className="space-y-2 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">🏠 {lang === 'bn' ? 'বাসা ভাড়া' : 'House Rent'}:</span>
                <span className="font-bold text-white">৳{formatBDT(recommendedMaxRent)} (30%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">⚡ {lang === 'bn' ? 'গ্যাস, বিদ্যুৎ ও পানি' : 'Utilities & Service'}:</span>
                <span className="font-bold text-white">৳{formatBDT(estUtilities)} (~7%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">🍲 {lang === 'bn' ? 'খাবার ও যাতায়াত' : 'Food, Groceries & Transport'}:</span>
                <span className="font-bold text-white">৳{formatBDT(estFoodLiving)} (35%)</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-emerald-400 font-bold">
                <span>💰 {lang === 'bn' ? 'সঞ্চয় / অতিরিক্ত' : 'Savings / Miscellaneous'}:</span>
                <span>৳{formatBDT(estSavings)} (~28%)</span>
              </div>
            </div>
          </div>

          {/* Recommended Areas */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? 'আপনার বাজেটের জন্য সেরা এলাকা:' : 'Best Neighborhoods for your budget:'}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {getRecommendedAreas().map((area, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs"
                >
                  📍 {area}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/90 shrink-0">
          <button onClick={onClose} className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold">
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
          <button
            onClick={() => {
              onApplyBudget(recommendedMaxRent);
              onClose();
            }}
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/25"
          >
            <span>{lang === 'bn' ? `৳${formatBDT(recommendedMaxRent)} এর মধ্যে ফ্ল্যাট দেখুন` : `Show Flats under ৳${formatBDT(recommendedMaxRent)}`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
