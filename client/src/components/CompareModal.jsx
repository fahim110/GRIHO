import React from 'react';
import { X, ArrowRight, Check, Minus, MessageCircle, MapPin, Building, Flame, Bed, Bath, ShieldCheck } from 'lucide-react';

export default function CompareModal({ isOpen, onClose, properties, onRemoveProperty, onOpenDetails, lang = 'en' }) {
  if (!isOpen) return null;

  const formatBDT = (amount) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>⚖️</span>
              <span>{lang === 'bn' ? 'ফ্ল্যাট তুলনা ও বিশ্লেষণ (Compare Homes)' : 'Side-by-Side Property Comparison'}</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {lang === 'bn' ? `মোট ${properties.length} টি ফ্ল্যাট তুলনার জন্য নির্বাচিত` : `Comparing ${properties.length} selected properties`}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 text-xs">
          {properties.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Building className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {lang === 'bn' ? 'তুলনার জন্য কোনো ফ্ল্যাট নির্বাচন করা হয়নি' : 'No properties selected for comparison'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {lang === 'bn' ? 'ফ্ল্যাট কার্ডের বিস্তারিত থেকে "তুলনা করুন" বাটনে ক্লিক করে এখানে যোগ করুন।' : 'Add properties to compare by clicking the compare button on property cards.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-left bg-slate-950/80 text-slate-400 font-bold w-44 rounded-l-2xl">
                      {lang === 'bn' ? 'বৈশিষ্ট্যসমূহ' : 'Key Specifications'}
                    </th>
                    {properties.map((p) => (
                      <th key={p._id} className="p-3 bg-slate-950/80 text-left min-w-[220px]">
                        <div className="relative">
                          <button
                            onClick={() => onRemoveProperty(p._id)}
                            className="absolute -top-1 -right-1 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-rose-400"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                            alt={p.title}
                            className="w-full h-24 rounded-xl object-cover mb-2"
                          />
                          <h4 className="font-bold text-white text-xs line-clamp-1">{p.title}</h4>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>{p.area}, {p.city}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {/* Monthly Rent */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">
                      {lang === 'bn' ? 'মাসিক ভাড়া' : 'Monthly Rent'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-3 text-emerald-400 font-extrabold text-sm">
                        ৳{formatBDT(p.rent)} <span className="text-[10px] text-slate-400 font-normal">/mo</span>
                      </td>
                    ))}
                  </tr>

                  {/* Service Charge */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">
                      {lang === 'bn' ? 'সার্ভিস চার্জ' : 'Service Charge'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-3 text-white font-medium">
                        {p.serviceCharge > 0 ? `৳${formatBDT(p.serviceCharge)}/mo` : 'Included'}
                      </td>
                    ))}
                  </tr>

                  {/* Gas Type */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">
                      {lang === 'bn' ? 'গ্যাস সংযোগ' : 'Gas Type'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.gasType === 'Titas Line Gas' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {p.gasType}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Tenant Policy */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">
                      {lang === 'bn' ? 'ভাড়াটিয়া ধরন' : 'Tenant Policy'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-3 font-semibold text-sky-300">
                        {p.tenantPolicy}
                      </td>
                    ))}
                  </tr>

                  {/* Bed / Bath / Area */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">
                      {lang === 'bn' ? 'বেড / বাথ / আয়তন' : 'Bed / Bath / Size'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-3 text-slate-200">
                        {p.bedrooms} Beds • {p.bathrooms} Baths • {p.sizeSqFt} sqft
                      </td>
                    ))}
                  </tr>

                  {/* Floor & Facing */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">
                      {lang === 'bn' ? 'তলা ও দিক' : 'Floor & Facing'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-3 text-slate-300">
                        {p.floor} • 🧭 {p.facing || 'South'}
                      </td>
                    ))}
                  </tr>

                  {/* Advance Deposit */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">
                      {lang === 'bn' ? 'অগ্রিম / জামানত' : 'Advance Deposit'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-3 text-slate-300">
                        {p.advanceDepositMonths || 2} Months (৳{formatBDT((p.rent || 0) * (p.advanceDepositMonths || 2))})
                      </td>
                    ))}
                  </tr>

                  {/* Lift & Generator */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">
                      {lang === 'bn' ? 'লিফট ও জেনারেটর' : 'Lift & Generator'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-3">
                        <div className="space-y-1 text-[11px]">
                          <div>{p.amenities?.lift ? '✅ Lift Available' : '❌ No Lift'}</div>
                          <div>{p.amenities?.generatorBackup ? '✅ Standby Generator' : '❌ No Generator'}</div>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Car Parking */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">
                      {lang === 'bn' ? 'গাড়ি পার্কিং' : 'Car Parking'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-3">
                        {p.amenities?.carParking ? '✅ Dedicated Space' : '❌ No Parking'}
                      </td>
                    ))}
                  </tr>

                  {/* Direct Contact */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">
                      {lang === 'bn' ? 'যোগাযোগ' : 'Action'}
                    </td>
                    {properties.map((p) => (
                      <td key={p._id} className="p-3">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenDetails(p);
                          }}
                          className="btn-primary w-full py-1.5 px-3 rounded-lg text-xs font-bold"
                        >
                          {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Full Details'}
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
