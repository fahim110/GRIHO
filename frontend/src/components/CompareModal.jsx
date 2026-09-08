import React from 'react';
import { X, ArrowRight, Check, Minus, MessageCircle, MapPin, Building, Flame, Bed, Bath, ShieldCheck } from 'lucide-react';
import PropertyVisual from './PropertyVisual';

export default function CompareModal({ isOpen, onClose, properties, onRemoveProperty, onOpenDetails, lang = 'en' }) {
  if (!isOpen) return null;

  const formatBDT = (amount) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 lg:p-10 animate-fade-in">
      <div
        className="relative w-full max-w-6xl 2xl:max-w-7xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 sm:px-12 py-7 border-b border-slate-800 bg-slate-950/95 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
              <span>⚖️</span>
              <span>{lang === 'bn' ? 'ফ্ল্যাট তুলনা ও বিশ্লেষণ (Compare Homes)' : 'Side-by-Side Property Comparison'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {lang === 'bn' ? `মোট ${properties.length} টি ফ্ল্যাট তুলনার জন্য নির্বাচিত` : `Comparing ${properties.length} selected rental properties`}
            </p>
          </div>
          <button onClick={onClose} className="p-3 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-8 sm:p-12 space-y-8 flex-1 text-base">
          {properties.length === 0 ? (
            <div className="text-center py-24 space-y-5">
              <Building className="w-20 h-20 text-slate-600 mx-auto" />
              <h3 className="text-xl font-bold text-white">
                {lang === 'bn' ? 'তুলনার জন্য কোনো ফ্ল্যাট নির্বাচন করা হয়নি' : 'No properties selected for comparison'}
              </h3>
              <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto">
                {lang === 'bn' ? 'ফ্ল্যাট কার্ডের বিস্তারিত থেকে "তুলনা করুন" বাটনে ক্লিক করে এখানে যোগ করুন।' : 'Add properties to compare by clicking the compare button on any property card.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-5 text-left bg-slate-950/90 text-slate-300 font-bold w-56 rounded-l-2xl text-sm sm:text-base">
                      {lang === 'bn' ? 'বৈশিষ্ট্যসমূহ' : 'Key Specifications'}
                    </th>
                    {properties.map((p) => (
                      <th key={p._id} className="p-5 bg-slate-950/90 text-left min-w-[260px]">
                        <div className="relative">
                          <button
                            onClick={() => onRemoveProperty(p._id)}
                            className="absolute -top-2 -right-2 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer shadow-lg"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="w-full h-32 rounded-2xl overflow-hidden mb-3 border border-slate-800">
                            <PropertyVisual property={p} aspect="aspect-[16/10]" showBadges={false} className="h-full p-2" />
                          </div>
                          <h4 className="font-extrabold text-white text-base line-clamp-1">{p.title}</h4>
                          <div className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{p.area}, {p.city}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm sm:text-base">
                  {/* Monthly Rent */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-300">
                      {lang === 'bn' ? 'মাসিক ভাড়া' : 'Monthly Rent'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-4 text-emerald-400 font-black text-xl">
                        ৳{formatBDT(p.rent)} <span className="text-xs text-slate-400 font-normal">/mo</span>
                      </td>
                    ))}
                  </tr>

                  {/* Service Charge */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-300">
                      {lang === 'bn' ? 'সার্ভিস চার্জ' : 'Service Charge'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-4 text-white font-medium">
                        {p.serviceCharge > 0 ? `৳${formatBDT(p.serviceCharge)}/mo` : 'Included'}
                      </td>
                    ))}
                  </tr>

                  {/* Gas Type */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-300">
                      {lang === 'bn' ? 'গ্যাস সরবরাহ' : 'Gas Type'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-4 font-bold text-amber-300">
                        🔥 {p.gasType}
                      </td>
                    ))}
                  </tr>

                  {/* Bed & Bath */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-300">
                      {lang === 'bn' ? 'বেড ও বাথ' : 'Bed & Bath'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-4 text-slate-200">
                        {p.bedrooms} Beds • {p.bathrooms} Baths
                      </td>
                    ))}
                  </tr>

                  {/* Floor Area */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-300">
                      {lang === 'bn' ? 'আয়তন' : 'Size (Sq. Ft)'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-4 text-slate-200">
                        {p.sizeSqFt} sq. ft
                      </td>
                    ))}
                  </tr>

                  {/* Tenant Policy */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-300">
                      {lang === 'bn' ? 'ভাড়াটিয়া নীতি' : 'Tenant Policy'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-4 font-semibold text-sky-300">
                        {p.tenantPolicy}
                      </td>
                    ))}
                  </tr>

                  {/* Lift & Generator */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-300">
                      {lang === 'bn' ? 'লিফট ও জেনারেটর' : 'Lift & Generator'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-4 text-slate-200">
                        {p.amenities?.lift ? '✅ Lift' : '❌ No Lift'} • {p.amenities?.generatorBackup ? '✅ Gen' : '❌ No Gen'}
                      </td>
                    ))}
                  </tr>

                  {/* Action row */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-300">
                      {lang === 'bn' ? 'পদক্ষেপ' : 'Actions'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-4">
                        <button
                          onClick={() => {
                            if (onOpenDetails) onOpenDetails(p);
                            onClose();
                          }}
                          className="btn-primary w-full py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
